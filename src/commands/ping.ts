import { Client, CommandInteraction, EmbedBuilder, SlashCommandBuilder, Colors } from 'discord.js';
import { Database } from "bun:sqlite";
import { hostname } from "node:os";

export const data: SlashCommandBuilder = new SlashCommandBuilder();
data.setName('ping');
data.setDescription('pong!');

export async function execute(interaction: CommandInteraction, db: Database, client: Client<true>) {
    const embed: EmbedBuilder = new EmbedBuilder();
    embed.setTitle('🏓 Pong!');
    embed.setDescription(`🌐 Válaszidő: ${client.ws.ping}ms\n🕐 Uptime: ${formatUptime(process.uptime())}`);
    embed.setColor(Colors.Red);
    embed.setFooter({text: `Hoszt: ${hostname()}`, iconURL: "https://imgur.com/YZKEpzl.png"});

    return interaction.reply({ embeds: [embed], flags: "Ephemeral" });
}

function formatUptime(seconds: number): string {
    const weeks = Math.floor(seconds / (7 * 24 * 60 * 60));
    seconds %= 7 * 24 * 60 * 60;

    const days = Math.floor(seconds / (24 * 60 * 60));
    seconds %= 24 * 60 * 60;

    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;

    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);

    const pad = (n) => n.toString().padStart(2, '0');

    let result = "";
    if (weeks > 0) result += `${weeks} week `;
    if (days > 0 || weeks > 0) result += `${days} day `;

    result += `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

    return result.trim();
}
