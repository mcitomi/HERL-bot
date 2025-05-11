import { Client, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, Colors, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, Message } from 'discord.js';
import { Database } from "bun:sqlite";

import { scheduleEventBefore } from "../module/schedule.ts";
import { createThread } from "../module/createThread.ts";

export const data: SlashCommandBuilder = new SlashCommandBuilder();
data.setName('createrace');
data.setDescription('Új esemény létrehozása!');
data.setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

data.addStringOption(o => {
    o.setName("title");
    o.setDescription("Verseny címe");
    o.setRequired(true);
    return o;
});

data.addStringOption(o => {
    o.setName("date");
    o.setDescription("Az időt ilyen formában add meg: 2025-05-12 16:08");
    o.setRequired(true);
    return o;
});

data.addAttachmentOption(o => {
    o.setName("pic");
    o.setDescription("Az eseményről egy kép");
    o.setRequired(true);
    return o;
});

export async function execute(interaction: ChatInputCommandInteraction, db: Database, client: Client<true>) {
    try {
        const title = interaction.options.getString("title");
        const date = interaction.options.getString("date");
        const attachment = interaction.options.getAttachment("pic");

        const embed: EmbedBuilder = new EmbedBuilder();
        embed.setTitle(title);
        embed.setDescription(`**🕐 Időpont**\n<t:${Date.parse(date) / 1000}:F>\nKezdés: <t:${Date.parse(date) / 1000}:R>`);
        embed.setImage(attachment.url)
        embed.setColor(Colors.Red);
        embed.addFields(
            { name: "<:elfogadva:1370233975359934484> Leszek", value: "-", inline: true },
            { name: "<:elutasitva:1370234110844338286> Nem leszek", value: "-", inline: true },
            { name: "<:kerdeses:1370252457296396309> Kérdéses", value: "-", inline: true },
            { name: "<:tartalek:1370234622817861693> Tartalék", value: "-", inline: true }
        );

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setEmoji("<:elfogadva:1370233975359934484>")
                    .setStyle(ButtonStyle.Success)
                    .setCustomId("elfogadva")
            )
            .addComponents(
                new ButtonBuilder()
                    .setEmoji("<:elutasitva:1370234110844338286>")
                    .setStyle(ButtonStyle.Danger)
                    .setCustomId("elutasitva")
            )
            .addComponents(
                new ButtonBuilder()
                    .setEmoji("<:kerdeses:1370252457296396309>")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId("kerdeses")
            )
            .addComponents(
                new ButtonBuilder()
                    .setEmoji("<:tartalek:1370234622817861693>")
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId("tartalek")
            );

     
        if(new Date(new Date(date).getTime() - 15 * 60 * 1000).getTime() - new Date().getTime() > 3 * 7 * 24 * 60 * 60 * 1000) {
            interaction.reply({flags: "Ephemeral", content: "⚠️ Az esemény nem hozható létre: Az időpont nem lehet 3 hétnél távolibb!"});    // A Node Date nem enged 24 napnál nagyobb értéket
            return;
        }

        const message = await (await interaction.reply({ embeds: [embed], components: [row.toJSON()] })).fetch();

        db.run(`INSERT INTO elements (name, id) VALUES ("raceembed", ?) ON CONFLICT(name) DO UPDATE SET id = excluded.id;`, [message.id]);
        db.run(`INSERT INTO elements (name, id) VALUES ("racedate", ?) ON CONFLICT(name) DO UPDATE SET id = excluded.id;`, [date]);
        db.run(`INSERT INTO elements (name, id) VALUES ("threadch", ?) ON CONFLICT(name) DO UPDATE SET id = excluded.id;`, [message.channel.id]);

        scheduleEventBefore(new Date(date), 15, () => {
            createThread(client, db);
        });

    } catch (error) {
        console.error(error);
    }
}
