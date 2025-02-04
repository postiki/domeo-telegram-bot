const dotenv = require('dotenv');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const localEnvPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(localEnvPath)) {
    dotenv.config({ path: localEnvPath });
} else {
    dotenv.config();
}

const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

if (!DB_USER || !DB_PASSWORD || !DB_HOST || !DB_PORT || !DB_NAME) {
    process.exit(1);
}

const connectionString = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

execSync(`npx kysely-codegen --dialect postgres --url="${connectionString}"`, { stdio: 'inherit' });
