import {z} from "zod";

export const UserStage = z.enum([
    'TYPE_OF_REPAIR',
    'CLASS_OF_REPAIR',
    'AREA',
    'PHONE_NUMBER',
    'COMPLETED',
])

export enum UserNotificationDelays {
    FIVE_MINUTES = 300,
    ONE_DAY = 86400,
    THREE_DAYS = 259200,
}

export type UserStage = z.infer<typeof UserStage>

export const UserModel = z.object({
    telegramId: z.number(),
    username: z.string(),
    registrationDate: z.date(),
    campaignId: z.string().nullable(),
    funnelStage: UserStage,
    stageTimestamp: z.date(),
});

export type UserModel = z.infer<typeof UserModel>;