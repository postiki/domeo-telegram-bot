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
import {DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER}  from "utils/config";

export const db = new Kysely<DB>({
    dialect: new PostgresDialect({
        pool: new Pool({
            user: DB_USER,
            database: DB_NAME,
            password: DB_PASSWORD,
            port: Number(DB_PORT),
            host: DB_HOST,
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

