const fs = require('node:fs');
const path = require('node:path');
const {Client,Events,GatewayIntentBits, Collection}=require('discord.js')
const {Player} = require("discord-player");
const{ YoutubeiExtractor}=require('discord-player-youtubei')
require('dotenv').config()


const token=process.env.DISCORD_TOKEN
const client = new Client({
    intents: [
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent
    ]
});



client.commands = new Collection();
add_commands()
add_events()
const player=new Player(client)
player.extractors.register(YoutubeiExtractor, {}).then(r =>{
    console.log("Youtube extractor registered")
})
player.extractors.loadDefault((ext) => ext !== 'YouTubeExtractor');

client.login(token);
function add_commands()
{
    const foldersPath = path.join(__dirname, 'commands');
    const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }

}
function add_events()
{
    const eventsPath = path.join(__dirname, 'events');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    }

}