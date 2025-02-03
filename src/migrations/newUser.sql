CREATE TABLE IF NOT EXISTS users (
                                     telegramId BIGINT PRIMARY KEY,
                                     username VARCHAR(255),
    registrationDate TIMESTAMP,
    campaignId VARCHAR(255),
    funnelStage INTEGER,
    stageTimestamp TIMESTAMP
    );