export enum NotificationType {
    STAGE_REMINDER = 'stage_reminder',
    FEEDBACK_REMINDER = 'feedback_reminder'
}

export enum StageNotificationDelays {
    FIVE_MINUTES = 5,
    ONE_DAY = 5,
    THREE_DAYS = 5,
}

export enum FeedbackNotificationDelays {
    TEN_MINUTES = 5,
    ONE_DAY = 5,
}

export const notificationSequences = {
    [NotificationType.STAGE_REMINDER]: [
        StageNotificationDelays.FIVE_MINUTES,
        StageNotificationDelays.ONE_DAY,
        StageNotificationDelays.THREE_DAYS
    ],
    [NotificationType.FEEDBACK_REMINDER]: [
        FeedbackNotificationDelays.TEN_MINUTES,
        FeedbackNotificationDelays.ONE_DAY,
    ]
};

export const notificationMessages = {
    [NotificationType.STAGE_REMINDER]: [
        '*Кажется, вы не завершили расчет ремонта\\!* \n' +
        'Завершите расчет за минуту, и мы предоставим полный расчет стоимости на примерах, а также бонус к заказу\\. Узнайте, сколько реально стоит ремонт и как подготовить квартиру\\! \n',

        '*Ваш персональный расчет УЖЕ готов\\!* \n' +
        'Вы не завершили процесс, и ваш расчет ждет вас\\. Завершите сейчас, и получите полный расчет вместе с эксклюзивным предложением от Domeo\\. \n',

        '*Только 24 часа, чтобы забрать ваш расчет и воспользоваться нашим специальным предложением\\!* Завершите расчет сейчас и получите подарок от Domeo\\. \n'
    ],
    [NotificationType.FEEDBACK_REMINDER]: [
        '*Ваш персональный расчет УЖЕ готов\\!* \n' +
        'Остался всего один шаг, чтобы получить точную стоимость ремонта и ваш подарок\\. Мы понимаем, как важно сделать правильный выбор, поэтому ваш номер нужен только для того, чтобы отправить полный расчет и помочь с консультацией\\. \n',

        '*Мы подготовили для вас нечто особенное\\!* \n' +
        'Завершите расчет, и мы не только отправим точную стоимость вашего ремонта, но и предложим эксклюзивные условия, которые будут доступны только вам 24 часа\\! Оставьте номер — это займет всего секунду\\!'
    ]
}