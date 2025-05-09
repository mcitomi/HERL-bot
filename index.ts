import { Database } from "bun:sqlite";
import { DiscordClient } from "./src/client.ts";
import { join } from "node:path";

const db = new Database(join(import.meta.dir, "herl.sqlite"), { create: true });

db.run(`CREATE TABLE IF NOT EXISTS elements (
    name TEXT UNIQUE,
    id TEXT
    );`
);

db.run(`CREATE TABLE IF NOT EXISTS reactedUsers (
    race TEXT,
    userId TEXT,
    role TEXT
    );`
);

DiscordClient(db).catch((e) => {
    console.error(e);
});
