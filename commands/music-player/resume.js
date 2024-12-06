const {useQueue} = require("discord-player");
const {isInVoiceChannel} = require("../utility/voicechannel");
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data:new SlashCommandBuilder().setName("resume").setDescription("Resume current song"),
    async execute(interaction) {
        const inVoiceChannel = isInVoiceChannel(interaction)
        if (!inVoiceChannel) {
            return
        }

        await interaction.deferReply();
        const queue = useQueue(interaction.guild.id)
        if (!queue || !queue.currentTrack)
            return void interaction.followUp({
                content: '❌ | No music is being played!',
            });
          const success = queue.node.resume()

        return void interaction.followUp({
            content: success ? '▶ | Resumed!' : '❌ | Something went wrong!',
        });
    },
};