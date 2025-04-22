require('dotenv').config();
const {
    Client,
    GatewayIntentBits,
    SlashCommandBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require('discord.js');
const fs = require('fs').promises;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
    ],
});

const TOKEN = process.env.DISCORD_TOKEN;
const GUILD = process.env.GUILD_ID;
const serverSettings = new Map();

const setupCommand = [
    new SlashCommandBuilder()
        .setName('set-verif')
        .setDescription('Настройка верификации')
        .addChannelOption(option =>
            option.setName('канал_для_верификации')
            .setDescription('канал для верификации')
            .setRequired(true))
        .addChannelOption(option =>
            option.setName('канал_для_анкет')
            .setDescription('канал для анкет')
            .setRequired(true))
        .addRoleOption(option =>
            option.setName('роль_верификации')
            .setDescription('роль для верификации')
            .setRequired(true))
        .addRoleOption(option =>
            option.setName('роль_удаления')
            .setDescription('роль для удаления')
            .setRequired(true)),

    new SlashCommandBuilder()
        .setName('set-rp')
        .setDescription('настройка рп')
        .addChannelOption(option =>
            option.setName('канал_для_заявок')
            .setDescription('канал для заявок')
            .setRequired(true))
        .addChannelOption(option =>
            option.setName('канал_для_рассмотрения')
            .setDescription('канал для рассмотрения')
            .setRequired(true)),

    new SlashCommandBuilder()
        .setName('add-rp-category')
        .setDescription('Добавить категорию рп')
        .addStringOption(option =>
            option.setName('название')
            .setDescription('название категории')
            .setRequired(true))
        .addChannelOption(option =>
            option.setName('канал')
            .setDescription('канал для категории')
            .setRequired(true))
        .addRoleOption(option =>
            option.setName('роль')
            .setDescription('роль категории')
            .setRequired(true)),

    new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Узнайте вашу судьбу задав вопрос :3')
        .addStringOption(option =>
            option.setName('вопрос')
            .setDescription('Ваш вопросик для меня :3')
            .setRequired(true))
];

async function LSettings() {
    try {
        const data = await fs.readFile('settings.json', 'utf8');
        const settings = JSON.parse(data);
        for(const [key, value] of Object.entries(settings)) {
            serverSettings.set(key, value);
        }
        console.log('Настройки загружены');
    } catch(error) {
        if(error.code === 'ENOENT') {
            await SSettings();
            console.log('Создан новый файл');
        } else {
            console.error('Ошибка загрузки настроек');
        }
    }
}

async function SSettings() {
    try {
        const settings = Object.fromEntries(serverSettings);
        await fs.writeFile('settings.json', JSON.stringify(settings, null, 2));
        console.log('Успешно сохранено');
    } catch(error) {
        console.error('Ошибка сохранения настроек: ', error);
    }
}

client.once("ready", async () => {
    console.log(`Bot is starting with a name ${client.user.tag}`);
    await client.application.commands.set(setupCommand); // Используем set вместо create
    await LSettings();
    client.user.setPresence({
        activities: [{ name: 'логи', type: 2 }],
        status: "dnd",
    });

    client.guilds.cache.forEach(async (guild) => {
        try {
            const member = await guild.members.fetchMe();
            if (member) {
                console.log(`Bot is present in guild ${guild.name}`);
                console.log("Bot permissions: ", member.permissions.toArray());
                console.log("Bot roles: ", member.roles.cache.map((role) => role.name).join(", "));
            }
        } catch(error) {
            console.error(`Ошибка загрузки данных о боте на сервере ${guild.name}`, error);
        }
    });
});

client.on('interactionCreate', async interaction => {
    if(!interaction.isCommand()) return;

    try {
        switch(interaction.commandName){
            case '8ball':
                const res = [
                    'Да, конечно :3',
                    'Да!',
                    'Возможно, да',
                    'Хотел бы знать...',
                    'Скорее всего, нет',
                    'Нет!',
                    'Не могу сказать',
                    'Спроси позже',
                    'Вероятно, да',
                    'Абсолютно нет!',
                ];

                const chance = Math.floor(Math.random() * res.length);
                const why = interaction.options.getString('вопрос');
                await interaction.reply(`Вопрос: ${why} \n${res[chance]}`);
                break;

            case 'set-verif':
                const verifChannel = interaction.options.getChannel('канал_для_верификации');
                const formChannel = interaction.options.getChannel('канал_для_анкет');
                const verifRole = interaction.options.getRole('роль_верификации');
                const deleteRole = interaction.options.getRole('роль_удаления');
                await interaction.reply('Настройки верификации сохранены!');
                serverSettings.set(`${interaction.guildId}_verif`, {
                    verificationChannel: verifChannel.id,
                    formChannel: formChannel.id,
                    verifRole: verifRole.id,
                    deleteRole: deleteRole.id,
                    enabled: true
                });
                const verifButton = new ButtonBuilder()
                    .setCustomId('verifbut')
                    .setLabel('Пройти верификацию')
                    .setStyle(ButtonStyle.Premium)
                break;

            case 'set-rp':
                const appChannel = interaction.options.getChannel('канал_для_заявок');
                const reviewChannel = interaction.options.getChannel('канал_для_рассмотрения');
                await interaction.reply('Настройки RP сохранены!');
                serverSettings.set(`${interaction.guildId}_rp`, {
                    appChannel: appChannel.id,
                    reviewChannel: reviewChannel.id,
                    categories: [],
                    enabled: true
                });
                break;

            case 'add-rp-category':
                const categoryName = interaction.options.getString('название');
                const categoryChannel = interaction.options.getChannel('канал');
                const categoryRole = interaction.options.getRole('роль');
                await interaction.reply('Категория RP добавлена!');
                break;

            default:
                await interaction.reply('Неизвестная команда!');
        }
    } catch(error) {
        console.error('Ошибка при обработке команды:', error);
        await interaction.reply('Произошла ошибка при выполнении команды.');
    }
});

client.login(TOKEN);
