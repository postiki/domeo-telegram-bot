import {notificationSequence} from "../db/models/User";
import {redis} from "./index";
import {NotificationType} from "utils/notify";

export async function scheduleNotification(userId: string, stage: string,type: NotificationType, attempt: number = 0) {
    const delay = notificationSequence[attempt];
    if (delay === undefined) return;

    const key = `notification:${userId}:stage:${stage}:type:${type}:attempt:${attempt}`;

    try {
        const isScheduled = await redis.set(key, 'pending', 'EX', delay, 'NX');

        if (isScheduled) {
            console.log(`✅ Scheduled ${type} push for user ${userId}, at: ${stage}, attempt: ${attempt + 1}, over ${delay}s`);
        }
    } catch (error) {
        console.error(`Failed to schedule ${type} notification:`, error);
    }
}

export async function removeNotifications(
    userId: string,
    stage: string,
    type: NotificationType
) {
    const keys = await redis.keys(`notification:${userId}:stage:${stage}:type:${type}:attempt:*`);
    if (keys.length) {
        await redis.del(...keys);
        console.log(`❌ Removed ${type} notifications for user ${userId} at ${stage}`);
    }
}