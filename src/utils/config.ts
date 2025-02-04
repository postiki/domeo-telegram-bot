import dotenv from 'dotenv';
import * as fs from "node:fs";

dotenv.config();

const env = process.env.NODE_ENV || 'local';
const envFiles = [`.env.${env}`, '.env.local'];

envFiles.forEach((file) => {
    if (fs.existsSync(file)) {
        const result = dotenv.config({ path: file });
        if (result.error) {
            console.error(`Error loading ${file}:`, result.error);
        } else {
            console.log(`Loaded ${file}`);
        }
    } else {
        console.log(`File not found: ${file}`);
    }
});

export const TELEGRAM_API_KEY = process.env.TELEGRAM_API_KEY!;
export const DB_USER = process.env.DB_USER!;
export const DB_NAME = process.env.DB_NAME!;
export const DB_PORT = process.env.DB_PORT!;
export const DB_HOST = process.env.DB_HOST!;
export const DB_PASSWORD = process.env.DB_HOST!;
export const REDIS_PORT = process.env.REDIS_PORT!;
export const REDIS_HOST = process.env.REDIS_HOST!;