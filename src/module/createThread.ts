import { Client, ChannelType, TextChannel, ThreadAutoArchiveDuration } from 'discord.js';
import { Database } from "bun:sqlite";

export async function createThread(client: Client<true>, db: Database) {
    try {
        const threadChId = (await db.query("SELECT id FROM elements WHERE name = 'threadch';").get() as { id: string; }).id;
        const raceDate = (await db.query("SELECT id FROM elements WHERE name = 'racedate';").get() as { id: string; }).id;

        const thread = await (await client.channels.fetch(threadChId) as TextChannel).threads.create({
            name: `HERL ${(new Date).toLocaleDateString("hu-HU")}`,
            autoArchiveDuration: ThreadAutoArchiveDuration.ThreeDays,
            reason: `HERL ${(new Date).toLocaleDateString("hu-HU")}`,
            type: ChannelType.PrivateThread
        });

        const acceptedUsers = (db.query("SELECT userId FROM reactedUsers WHERE role = 'elfogadva' OR role = 'tartalek' AND race = ?;").all(raceDate) as { userId: string; }[]);

        for (const u of acceptedUsers) {
            try {
                await thread.members.add(u.userId);
            } catch (err) {
                console.error(`Unable to add user, ID: ${u.userId}`, err);
            }
        }
    } catch (error) {
        console.error(error);
    }
}
