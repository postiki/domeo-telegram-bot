CREATE TABLE IF NOT EXISTS users (
    telegram_id TEXT PRIMARY KEY NOT NULL ,
    username text NOT NULL ,
    registration_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    campaign_id text,
    stage text,
    stage_timestamp TIMESTAMPTZ,
    type_of_repair text,
    class_of_repair text,
    type_of_area text,
    area_of_repair text,
    phone_number text,
    completed BOOLEAN NOT NULL DEFAULT FALSE
    );