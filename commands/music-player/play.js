const { SlashCommandBuilder } = require('discord.js');
const {ApplicationCommandOptionType} = require('discord.js');
const {useMainPlayer} = require('discord-player');
const {isInVoiceChannel} = require('../utility/voicechannel');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song in your channel!')
        .addStringOption(option =>
                    option
                        .setName('query')
                        .setDescription('The song you want to play')
                        .setRequired(true),
        ),
    async execute(interaction) {
        const { default: Conf } = await import('conf');
        try {
            const inVoiceChannel = isInVoiceChannel(interaction);
            if (!inVoiceChannel) {
                return interaction.reply({ content: 'You must be in a voice channel!', ephemeral: true });
            }

            await interaction.deferReply();

            const player = useMainPlayer();
            const query = interaction.options.getString('query');
            const searchResult = await player.search(query);
            if (!searchResult.hasTracks()) {
                return void interaction.followUp({ content: 'No results were found!' });
            }

            try {
                const config = new Conf({ projectName: 'volume' });

                await player.play(interaction.member.voice.channel.id, searchResult, {
                    nodeOptions: {
                        metadata: {
                            channel: interaction.channel,
                            client: interaction.guild?.members.me,
                            requestedBy: interaction.user.username,
                        },
                        leaveOnEmptyCooldown: 300000,
                        leaveOnEmpty: true,
                        leaveOnEnd: false,
                        bufferingTimeout: 0,
                        volume: config.get('volume') || 10,
                    },
                });

                await interaction.followUp({
                    content: `⏱ | Loading your ${searchResult.playlist ? 'playlist' : 'track'}...`,
                });
            } catch (error) {
                await interaction.editReply({
                    content: 'An error has occurred!',
                });
                console.error(error);
            }
        } catch (error) {
            await interaction.reply({
                content: 'There was an error trying to execute that command: ' + error.message,
            });
            console.error(error);
        }
    },
};
