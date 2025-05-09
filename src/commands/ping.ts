import { Client, CommandInteraction, EmbedBuilder, SlashCommandBuilder, Colors } from 'discord.js';
import { Database } from "bun:sqlite";

export const data: SlashCommandBuilder = new SlashCommandBuilder();
data.setName('ping');
data.setDescription('pong!');

export async function execute(interaction: CommandInteraction, db: Database, client: Client<true>) {
    const embed: EmbedBuilder = new EmbedBuilder();
    embed.setTitle('🏓 Pong!');
    embed.setDescription(`Latency: ${client.ws.ping}ms`);
    embed.setColor(Colors.Red);

    return interaction.reply({ embeds: [embed] });
}
