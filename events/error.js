const { Events } = require('discord.js');


module.exports = {
    name: Events.Error,
    async execute(message) {
       console.log(message)
    },
};
