import Redis from "ioredis";
import {REDIS_HOST, REDIS_PORT} from "utils/config";
import {scheduleNotification} from "./scheduleUserNotify";
import {bot} from "../bot";
import {notificationMessages, notificationSequences, NotificationType} from "utils/notify";

export const redisConfig = {
    host: REDIS_HOST,
    port: Number(REDIS_PORT) || 6379,
};

export const redis = new Redis(redisConfig);

export async function listenForNotifications() {
    try {
        const subscriber = redis.duplicate();

        await subscriber.config('SET', 'notify-keyspace-events', 'KEA');
        await subscriber.subscribe('__keyevent@0__:expired');

        console.log('Successfully subscribed to expired events');

        subscriber.on('message', async (channel, key: string) => {
            if (!key.startsWith('notification:')) return;

            const [, userId, , stage, , type, , attempt] = key.split(':');
            const nextAttempt = parseInt(attempt) + 1;

            const notificationType = type as NotificationType;
            const sequence = notificationSequences[notificationType];
            const messages = notificationMessages[notificationType];

            console.log(`⏰ ${notificationType} push for user ${userId} at ${stage}, attempt: ${nextAttempt}`);

            const message = messages[parseInt(attempt)];
            if (message) {
                console.log(`Sending message`);
                await bot.telegram.sendMessage(userId, message, {parse_mode: "MarkdownV2"});
            }

            if (nextAttempt < sequence.length) {
                await scheduleNotification(userId, stage, notificationType, nextAttempt);
            } else {
                console.log(`🔕 ${notificationType} sequence for user ${userId} at ${stage} finished.`);
            }
        });

        subscriber.on('error', (error) => {
            console.error('Subscriber error:', error);
        });

    } catch (error) {
        console.error('❌ Failed to subscribe to Redis:', error);
    }
}

async function main() {
    try {
        await redis.ping();
        console.log('Redis is connected');
        await listenForNotifications();
    } catch (error) {
        console.error('Error during initialization:', error);
    }
}

main();
