import {
    IsolationLevel,
    Kysely,
    PostgresDialect,
    RawBuilder,
    sql,
    Transaction,
} from 'kysely';
import { DB } from 'kysely-codegen';
import { Pool } from 'pg';

export const db = new Kysely<DB>({
    dialect: new PostgresDialect({
        pool: new Pool({
            user: process.env.DB_USER,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: Number(process.env.DB_PORT),
            host: process.env.DB_HOST,
            application_name: 'telegram-bot',
        }),
    }),
});

export const transaction = async <T>(
    callback: (tx: Transaction<DB>) => Promise<T>,
    isolationLevel: IsolationLevel = 'read committed',
) => db.transaction().setIsolationLevel(isolationLevel).execute<T>(callback);

export const jsonb = <T>(value: T): RawBuilder<T> => {
    return sql`${JSON.stringify(value)}::jsonb`;
};

