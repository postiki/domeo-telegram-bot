import {db} from "db";
import {UserModel, UserStage} from "db/models/User";
import {parseItemStrict} from "utils/parseItems";
import {Stage} from "telegraf/scenes";

export async function createUser({telegramId, username, campaignId}: {
    telegramId: string,
    username: string,
    campaignId: string
}) {
    const result = await db.insertInto('users').values({
        telegram_id: telegramId,
        username,
        campaign_id: campaignId,
        stage: UserStage.Enum.TYPE_OF_REPAIR,
    }).returningAll().executeTakeFirstOrThrow();

    return result
}

export async function getUser(telegramId: string) {
    const user = await db.selectFrom('users').selectAll().where('telegram_id', '=', telegramId).executeTakeFirst();

    if (!user) {
        console.log(`User with telegramId ${telegramId} not found.`);
        return null;
    }

    return parseItemStrict(UserModel, user);
}

export async function updateUserStage(telegramId: string, stage: UserStage, value: string) {
    const fieldName = stage.toLowerCase();

    await db.updateTable('users').where('telegram_id', '=', telegramId).set({
        [fieldName]: value,
        stage: stage,
        stage_timestamp: new Date(),
    }).executeTakeFirstOrThrow();
}

export async function completeUserFunnel(telegramId: string) {
    await db.updateTable('users').where('telegram_id', '=', telegramId).set({
        completed: true,
        stage: UserStage.Enum.COMPLETED,
    }).executeTakeFirstOrThrow()
}