const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require("discord-player");
const { isInVoiceChannel } = require('../utility/voicechannel');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription("Shuffles the current playlist"),

    async execute(interaction) {
        // Check if the user is in a voice channel
        const inVoiceChannel = isInVoiceChannel(interaction);
        if (!inVoiceChannel) {
            return interaction.reply({ content: '❌ | You need to be in a voice channel to use this command!', ephemeral: true });
        }

        await interaction.deferReply();

        // Get the current queue
        const queue = useQueue(interaction.guild.id);
        if (!queue || !queue.currentTrack) {
            return interaction.followUp({ content: '❌ | No music is being played!' });
        }

        try {
            // Shuffle the queue
            queue.tracks.shuffle();

            // Helper function to trim strings
            const trimString = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);

            // Send the response embed
            return interaction.followUp({
                embeds: [{
                    title: 'Playlist Shuffled',
                    description: trimString(
                        `🎶 | The current song playing is **${queue.currentTrack.title}**!\n🎵 | The playlist has been shuffled.`,
                        4095
                    ),
                    color: 0x00FF00,
                }],
            });
        } catch (error) {
            console.error(error);
            return interaction.followUp({
                content: '❌ | Something went wrong!',
            });
        }
    }
};
