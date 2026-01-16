import "dotenv/config";
import type { MigrationConfig } from "drizzle-orm/migrator";

type APIConfig = {
  fileServerHits: number;
  dbURL: string;
  platform: string;
};

type DBConfig = {
  url: string,
  migrationConfig: MigrationConfig
};

type Config = {
  api: APIConfig,
  db: DBConfig
};

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};

export const config: Config = {
    api: {
      fileServerHits: 0,
      dbURL: envOrThrow("DB_URL"),
      platform: envOrThrow("PLATFORM"),
    },
    db: {
      url: envOrThrow("DB_URL"),
      migrationConfig: migrationConfig,
    }
};


function envOrThrow(item: string): string {
  const key = process.env[item];
  if (!key) {
    throw new Error(`Env variable ${item} unavailable`);
  }
  return String(key);
};