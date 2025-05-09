import { Client, CommandInteraction, ButtonInteraction, EmbedBuilder, Message } from 'discord.js';
import { Database } from "bun:sqlite";
import { join } from 'node:path';

import { cmdMap } from './ready.ts';

export async function execute(client: Client, db: Database, interaction: CommandInteraction) {
    try {
        if (interaction.isButton()) {
            const button = interaction as ButtonInteraction;

            const raceEmbedId = (await db.query("SELECT id FROM elements WHERE name = 'raceembed';").get() as { id: string; }).id;

            async function updateEmbed() {
                const message = await button.message.fetch();
                const embed = (message.toJSON() as Message).embeds[0];

                const users = db.query("SELECT userId, role FROM reactedUsers WHERE race = ?;").all(button.message.id) as { userId: string, role: string; }[];

                function getUsersInRole(role: string) {
                    return `${users.map(user => {
                        if(user.role == role) {
                            return `<@${user.userId}>`;
                        }
                    }).join("\n")}`;
                }

                const newEmbed: EmbedBuilder = new EmbedBuilder()
                .setTitle(embed.title)
                .setDescription(embed.description)
                .setImage(embed.image.url)
                .setColor(embed.color)
                .addFields(
                    { name: "<:elfogadva:1370233975359934484> Leszek", value: getUsersInRole("elfogadva"), inline: true },
                    { name: "<:elutasitva:1370234110844338286> Nem leszek", value: getUsersInRole("elutasitva"), inline: true },
                    { name: "<:kerdeses:1370252457296396309> Kérdéses", value: getUsersInRole("kerdeses"), inline: true },
                    { name: "<:tartalek:1370234622817861693> Tartalék", value: getUsersInRole("tartalek"), inline: true }
                );

                message.edit({embeds: [newEmbed]});
            }

            if (raceEmbedId != button.message.id) {
                return;
            }

            const userChoice = db.query("SELECT * FROM reactedUsers WHERE userId = ? AND race = ?;").get(button.user.id, button.message.id) as { race: string, userId: string, role: string };

            if (userChoice && userChoice.role == button.customId) {
                button.reply({ flags: "Ephemeral", content: "Ugyan azt a szerepet választottad!" });
                return;
            }

            updateEmbed();

            if (!userChoice) {
                db.run("INSERT INTO reactedUsers (race, userId, role) VALUES (?,?,?);", [button.message.id, button.user.id, button.customId]);
                button.reply({ flags: "Ephemeral", content: "Sikeresen kiválaszottad ezt:" + button.customId });
                return;
            }

            if (userChoice) {
                db.run("UPDATE reactedUsers SET role = ? WHERE userId = ?;", [button.customId, button.user.id]);
                button.reply({ flags: "Ephemeral", content: "Sikeresen frissítetted szereped erre: " + button.customId + "!" });
                return;
            }
            return;
        }

        const cmd = await require(join(import.meta.dir, "..", "commands", cmdMap.find((x) => x.cmd == interaction.commandName)?.file));

        cmd.execute(interaction, db, client);
    } catch (e: unknown) {
        console.log('Interaction handler error:', e);
    }
}
