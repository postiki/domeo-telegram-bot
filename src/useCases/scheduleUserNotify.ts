import {UserNotificationDelays, UserStage} from "../db/models/User";

function scheduleNotification(userId: number, stage: UserStage, delay: UserNotificationDelays) {
    const key = `notification:${userId}:stage:${stage}`;
    redis.set(key, 'pending', 'EX', delay);
}