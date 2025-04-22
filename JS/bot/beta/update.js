require("dotenv").config();
const {
    Client,
    GatewayIntentBits,
    ActionRowBuilder,
    TextInputBuilder,
    TextInputStyle,
    EmbedBuilder,
    ButtonBuilder,
    StringSelectMenuBuilder,
    Events,
    SlashCommandBuilder,
} = require("discord.js");

const fs = require("fs");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
    ],
});

const TOKEN = process.env.DISCORD_TOKEN;
const GUILD = process.env.GUILD_ID;

let settings_bot;
try {
    settings_bot = JSON.parse(fs.readFileSync('settings.json', 'utf8'));
} catch (error) {
    console.error('Error reading settings.json:', error);
    settings_bot = { verification: { verifChanId: null } }; // Default settings
}

function saveSettings() {
    fs.writeFileSync('settings.json', JSON.stringify(settings_bot, null, 2));
}

const setVerificationChannel = new SlashCommandBuilder()
    .setName('set-verification-channel')
    .setDescription('Установка канала для верификации')
    .addChannelOption(option =>
        option.setName('канал')
            .setDescription('канал для верификации')
            .setRequired(true));

client.on('ready', async () => {
    console.log('bot is ready');
    await client.application.commands.create(setVerificationChannel, GUILD);
});

client.on('interactionCreate', async (interaction) => {
    if(!interaction.isCommand()) return;
    
    const { commandName, options } = interaction;

    if(commandName === 'set-verification-channel') {
        const channel = options.getChannel('канал');
        settings_bot.verification.verifChanId = channel.id;
        saveSettings();
        await interaction.reply(`Channel set to ${channel.name}`);
    }
});

client.login(TOKEN);
