import {Markup, Scenes} from "telegraf";
import {completeUserFunnel, updateUserStage} from "../../repositories/UserRepo";
import {UserStage} from "../../db/models/User";
import {MyContext} from "../types";
import {message} from "telegraf/filters";
import {removeNotifications, scheduleNotification} from "../../redis/scheduleUserNotify";
import {NotificationType} from "utils/notify";

export const calculateCost = new Scenes.WizardScene<MyContext>('CALCULATE_COST',
    async ctx => {
        if (ctx.chat) {
            const telegramId = ctx.chat.id.toString();
            await ctx.replyWithMarkdownV2(
                'Вопрос 1 из 4\n' +
                'Какой ремонт вам необходим \\?',
                Markup.keyboard(['Косметичекий', 'Капительный'
                ])
            );
            await scheduleNotification(telegramId, UserStage.Enum.TYPE_OF_REPAIR, NotificationType.STAGE_REMINDER)
            return ctx.wizard.next();
        }
    },
    async ctx => {
        if (ctx.has(message("text"))) {
            const message = ctx.message.text;
            const telegramId = ctx.chat.id.toString();

            await updateUserStage(telegramId, UserStage.Enum.TYPE_OF_REPAIR, message)
            await removeNotifications(telegramId, UserStage.Enum.TYPE_OF_REPAIR, NotificationType.STAGE_REMINDER)

            await ctx.replyWithMarkdownV2(
                'Вопрос 2 из 4\n' +
                'Отлично\\. Какой класс вам ближе\\?',
                Markup.keyboard(['Комфорт', 'Бизнес'])
            );
            await scheduleNotification(telegramId, UserStage.Enum.CLASS_OF_REPAIR, NotificationType.STAGE_REMINDER)
            return ctx.wizard.next();
        }
    },
    async ctx => {
        if (ctx.has(message("text"))) {
            const message = ctx.message.text;
            const telegramId = ctx.chat.id.toString();

            await updateUserStage(telegramId, UserStage.Enum.CLASS_OF_REPAIR, message)
            await removeNotifications(telegramId, UserStage.Enum.CLASS_OF_REPAIR, NotificationType.STAGE_REMINDER)

            await ctx.replyWithMarkdownV2(
                'Вопрос 3 из 4\n' +
                'Какой у вас тип помещения\\?',
                Markup.keyboard(['Новостройка', 'Вторчика'])
            );
            await scheduleNotification(telegramId, UserStage.Enum.TYPE_OF_AREA, NotificationType.STAGE_REMINDER)
            return ctx.wizard.next();
        }
    },
    async ctx => {
        if (ctx.has(message("text"))) {
            const message = ctx.message.text;
            const telegramId = ctx.chat.id.toString();

            await updateUserStage(telegramId, UserStage.Enum.TYPE_OF_AREA, message)
            await removeNotifications(telegramId, UserStage.Enum.TYPE_OF_AREA, NotificationType.STAGE_REMINDER)

            await ctx.replyWithMarkdownV2(
                'Вопрос 4 из 4\n' +
                'Сколько квадратных метров площадь помещения\\?\n' +
                'Необходимо указать целое число\\.',
                Markup.removeKeyboard()
            );
            await scheduleNotification(telegramId, UserStage.Enum.AREA_OF_REPAIR, NotificationType.STAGE_REMINDER)
            return ctx.wizard.next();
        }
    },
    async ctx => {
        if (ctx.has(message("text"))) {
            const message = ctx.message.text;
            if (!isNaN(Number(message))) {

                const telegramId = ctx.chat.id.toString();

                await updateUserStage(telegramId, UserStage.Enum.AREA_OF_REPAIR, message)
                await removeNotifications(telegramId, UserStage.Enum.AREA_OF_REPAIR, NotificationType.STAGE_REMINDER)

                await ctx.replyWithMarkdownV2(
                    'Ваш расчет готов\\! На какой номер телефона в Telegram выслать стоимость\\?\n' +
                    'Например\\: 79991807777\n' +
                    'Или нажмите на кнопку ниже\\.\n' +
                    'Мы закрепим подарок за вашим номером 🎁'
                );
                await scheduleNotification(telegramId, UserStage.Enum.PHONE_NUMBER, NotificationType.FEEDBACK_REMINDER)
                return ctx.wizard.next();
            } else {
                await ctx.replyWithMarkdownV2('Пожалуйста\\, введите целое число для площади помещения\\.');
                return ctx.wizard.selectStep(ctx.wizard.cursor);
            }
        }
    },
    async (ctx) => {
        if (ctx.has(message("text")) && ctx.chat) {
            const message = ctx.message.text;
            const phoneRegex = /^7\d{10}$/;

            if (phoneRegex.test(message)) {
                const telegramId = ctx.chat.id.toString();
                await updateUserStage(telegramId, UserStage.Enum.PHONE_NUMBER, message)
                await removeNotifications(telegramId, UserStage.Enum.PHONE_NUMBER, NotificationType.FEEDBACK_REMINDER)

                await ctx.replyWithMarkdownV2('Спасибо\\! Ваш расчет будет выслан на указанный номер\\.',
                    Markup.removeKeyboard()
                );

                await completeUserFunnel(telegramId);

                await ctx.replyWithMarkdownV2(
                    'Хотите узнать больше о нашей компании\\?',
                    Markup.keyboard([
                        ['about company']
                    ])
                );

                return ctx.scene.leave();
            } else {
                await ctx.replyWithMarkdownV2(
                    'Неверный формат номера\\. Пожалуйста\\, введите номер в формате 79991807777\\.'
                );
                return ctx.wizard.selectStep(ctx.wizard.cursor);
            }
        }
    }
);