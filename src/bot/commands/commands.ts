import {Composer, Markup} from "telegraf";
import {createUser, getUser} from "../../repositories/UserRepo";
import {MyContext} from "../types";

export const commands = new Composer<MyContext>()

commands.start(async ctx => {
    if (ctx.message && ctx.chat && ctx.chat.type === 'private' && ctx.chat.username) {
        const telegramId = ctx.chat.id.toString();
        const username = ctx.chat.username;
        const existingUser = await getUser(telegramId);

        if (!existingUser) {
            await createUser({telegramId: telegramId, username: username, campaignId: ctx.startPayload})

            await ctx.replyWithMarkdownV2(
                'Уже 11 лет мы в Domeo делаем качественный ремонт квартир в Москве и СПб по фиксированным ценам\\.\n' +
                'Нас рекомендуют: ЦИАН, Комсомольская правда, Houzz, Forumhouse, Миэль\\.\n' +
                '\n' +
                '\\- Гарантия до 5 лет\\. Рассрочка 0% на 18 мес\\;\n' +
                '\\- Не универсалы\\! Команда узкопрофильных отделочников\\;\n' +
                '\\- Единственные в России, кто работает по технологическим картам\\;\n' +
                '\\- Контролируем стандарты на всех этапах\\.',
            )
            await ctx.replyWithMarkdownV2(
                'Что дальше\\?\n' +
                'Вы можете рассчитать примерную стоимость ремонта своей квартиры по кнопкам ниже\\. Быстро, онлайн и бесплатно\\.\n' +
                'А еще познакомиться с уже выполненными проектами Domeo и отзывами клиентов, чтобы убедиться в качестве нашей работы\\.',
                Markup.keyboard([
                    ['Рассчитать стоимость']
                ])
            )
        } else {
            //TODO TBA
        }
    }
});


commands.hears('Рассчитать стоимость', async ctx => {
    await ctx.scene.enter('CALCULATE_COST')
})