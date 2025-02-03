import {UserStage, UserModel} from "../db/models/User";
import {parseItem, parseItemStrict} from "../utils/parseItems";

export async function createUser({telegramId, username, campaignId}: {telegramId: number, username: string, campaignId: string}) {
  const result =  await db.insertInto('users').values({
      telegramId,
      username,
      campaignId,
      funnelStage: UserStage.Enum.TYPE_OF_REPAIR,
    }).returningAll().executeTakeFirstOrThrow();

  return result
}

export async function getUser(telegramId: number): Promise<UserModel | null> {
    const user = await db.selectFrom('users').selectAll().where('telegramId', '=', telegramId).executeTakeFirstOrThrow();

    return parseItemStrict(UserModel, user)
}