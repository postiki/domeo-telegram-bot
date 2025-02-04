import {session, Telegraf} from "telegraf";
import {MyContext} from "./types";
import {commands} from "./commands/commands";
import {stage} from "./scenes";
import {TELEGRAM_API_KEY} from "../utils/config";


export const bot = new Telegraf<MyContext>(TELEGRAM_API_KEY);

bot.use(session());
bot.use(stage.middleware())
bot.use(commands.middleware())

bot.launch()