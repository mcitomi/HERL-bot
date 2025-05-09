import { Client, REST, Routes, SlashCommandBuilder } from 'discord.js';
import { join } from "node:path";
import { readdirSync } from "node:fs";
import { Database } from "bun:sqlite";

import { token } from "../../config.json";

import { scheduleEventBefore } from "../module/schedule.ts";
import { createThread } from "../module/createThread.ts";

export const cmdMap: {
    cmd: string;
    file: string;
}[] = [];
const commands: SlashCommandBuilder[] = [];

export async function execute(client: Client<true>, db: Database) {
    try {
        const commandDir = readdirSync(join(process.cwd(), "src", "commands"))
            .filter((f) => f.endsWith('.ts'));

        for (const element of commandDir) {
            const file = await import(join(process.cwd(), "src", "commands", element));
            commands.push(file.data.toJSON());
            cmdMap.push({ cmd: file.data.toJSON().name, file: element });
            console.log(`[command] - ${element} command loaded!`);
        }

        (new REST({ version: '10' }).setToken(token)).put(Routes.applicationCommands(client.user!.id), {
            body: commands,
        });

        const raceDate = (await db.query("SELECT id FROM elements WHERE name = 'racedate';").get() as { id: string; }).id;

        scheduleEventBefore(new Date(raceDate), 15, () => {
            createThread(client, db);
        });

    } catch (e: unknown) {
        console.log('Command loader error:', e);
    }
}