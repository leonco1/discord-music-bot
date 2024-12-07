const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require("discord-player");
const { isInVoiceChannel } = require('../utility/voicechannel');

module.exports={

    data:new SlashCommandBuilder().setName('stop').setDescription("Stops all songs "),
    async execute(interaction){

        const inVoiceChannel = isInVoiceChannel(interaction)
        if (!inVoiceChannel) {
            return
        }
            await interaction.deferReply()

        const queue=useQueue(interaction.guild.id)
        if(!queue||!queue.currentTrack)
            return void interaction.followUp({
                content: '❌ | No music is being played!',
            })
        queue.node.stop()

        return void interaction.followUp({content: '🛑 | Stopped the player!'});
    }
}