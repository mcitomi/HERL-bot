import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { Database } from "bun:sqlite";
import { token } from '../config.json';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

export async function DiscordClient(db: Database) {
    const client: Client<boolean> = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildPresences,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.DirectMessageReactions,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildEmojisAndStickers,
            GatewayIntentBits.GuildModeration,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.DirectMessageReactions,
            GatewayIntentBits.GuildPresences,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.GuildInvites,
        ],
        partials: [Partials.Channel, Partials.Message, Partials.Reaction, Partials.User, Partials.GuildMember],
    });

    try {
        readdirSync(join(import.meta.dir, 'events'))
            .filter((f) => f.endsWith('.ts') || f.endsWith('.js'))
            .forEach((eventFile) => {
                const eventName = eventFile.split('.').shift();
                const eventPath = join(import.meta.dir, 'events', eventFile);

                client.on(eventName, async (...args) => (await require(eventPath)).execute(client, db, ...args));

                console.log(`${eventFile} event loaded!`);
            });
    } catch (e: unknown) {
        console.error('Event loader error:', e);
    }

    client.login(token);
}
