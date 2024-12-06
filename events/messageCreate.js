const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot || !message.guild) return;
        if (!message.client.application?.owner) await message.client.application?.fetch();
        if (message.content === '!deploy' && message.author.id === message.client.application?.owner?.id) {
            await message.guild.commands
                .set(message.client.commands)
                .then(() => {
                    message.reply('Deployed!');
                })
                .catch(err => {
                    message.reply('Could not deploy commands! Make sure the bot has the application.commands permission!');
                    console.error(err);
                });
        }
    },
};
