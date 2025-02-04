import {z} from "zod";

export const UserStage = z.enum([
    'TYPE_OF_REPAIR',
    'CLASS_OF_REPAIR',
    'TYPE_OF_AREA',
    'AREA_OF_REPAIR',
    'PHONE_NUMBER',
    'COMPLETED',
])

// export enum UserNotificationDelays {
//     FIVE_MINUTES = 300,
//     ONE_DAY = 86400,
//     THREE_DAYS = 259200,
// }

export enum UserNotificationDelays {
    FIVE_MINUTES = 5,
    ONE_DAY = 10,
    THREE_DAYS = 15,
}

export const notificationSequence = [
    UserNotificationDelays.FIVE_MINUTES,
    UserNotificationDelays.ONE_DAY,
    UserNotificationDelays.THREE_DAYS
];

export type UserStage = z.infer<typeof UserStage>

export const UserModel = z.object({
    telegramId: z.string(),
    username: z.string(),
    registrationDate: z.date(),
    campaignId: z.string().nullable(),
    stage: UserStage.nullable(),
    stageTimestamp: z.date().nullable(),
    typeOfRepair: z.string().nullable(),
    classOfRepair: z.string().nullable(),
    typeOfArea: z.string().nullable(),
    areaOfRepair: z.string().nullable(),
    phoneNumber: z.string().nullable(),
    completed: z.boolean().default(false)
});

export type UserModel = z.infer<typeof UserModel>;