require('dotenv').config();
const { count } = require('console');
const {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    SlashCommandBuilder,
    ButtonBuilder,
    ModalBuilder,
    ButtonStyle,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    Events,
    MessageFlags,
} = require('discord.js');
const { send } = require('process');
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

const TOKEN = process.env.DISCORD_TOK;
const GUILD = process.env.GUILD_ID;
const serverSettings = new Map();
const setupCommand = [
    new SlashCommandBuilder()
        .setName('set-verif')
        .setDescription('Насройка верификации')
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
            .setDescription('роль для вдаления')
            .setRequired(true))
        .addBooleanOption(option =>
            option.setName('сообщество')
            .setDescription('определяет будет ли вопрос про отношение к сообществу')
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
            console.log('Cоздан новый файл');
        } else {
            console.error('ошибка загрузки настроек');
        }
    }
}
async function SSettings() {
    try {
        const settings = Object.fromEntries(serverSettings);
        await fs.writeFile('settings.json', JSON.stringify(settings, null, 2));
        console.log('Успешно сохранено')
    } catch(error) {
        console.error('ошибка загрузки настроек: ', error);
    }
}

client.once("ready", async () => {
    await LSettings();
    console.log(`Bot is starting with a name ${client.user.tag}`);
    await client.application.commands.set(setupCommand);

    client.user.setPresence({
        activities: [{ name: 'логи', type: 1 }],
        status: "dnd",
    });

    client.guilds.cache.forEach(async (guild) => {
        try {
            const member = await guild.members.fetchMe()
            console.log(`Bot is present a guild ${guild.name}`);
            console.log("Bot permission: ", member.permissions.toArray());
            console.log(
                "Bot roles: ", 
                member.roles.cache.map((role) => role.name).join(", "),
            );
        } catch(error) {
            console.error(
                `Ошибка загрузки данных о боте на сервере ${guild.name}`,
                error,
            );
        }
    });
    await console.log(GUILD)
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
                await interaction.reply(`Вопрос: ${why}\n${res[chance]}`)
                break;
            case 'set-verif':
                const vChannel = interaction.options.getChannel('канал_для_верификации');
                const lChannel = interaction.options.getChannel('канал_для_анкет');
                const vRole = interaction.options.getRole("роль_верификации");
                const rRole = interaction.options.getRole('роль_удаления');
                const Com = interaction.options.getBoolean('сообщество')

                serverSettings.set(`${interaction.guildId}_verif_Channel`, {
                    vChannel: vChannel.id,
                    lChannel: lChannel.id,
                    vRole: vRole.id,
                    rRole: rRole.id,
                    enabled: true,
                    Com: Com, 
                });

                const vButton = new ButtonBuilder()
                    .setCustomId('verify')
                    .setLabel('Пройти верификацию')
                    .setStyle(ButtonStyle.Primary);

                const row = new ActionRowBuilder().addComponents(vButton);

                await vChannel.send({
                    content: 'Для начала общения, пожалуйста пройдите верификацию :3',
                    components: [row]
                });

                await interaction.reply({
                    content: 'настройка завершена',
                    flags: MessageFlags.Ephemeral 
                });
                
                await SSettings();
                break;

            case 'set-rp':
                const aChannel = interaction.options.getChannel('канал_для_заявок');
                const rChannel = interaction.options.getChannel('канал_для_рассмотрения');

                serverSettings.set(`${interaction.guildId}_rp`, {
                    aChannel: aChannel.id,
                    rChannel: rChannel.id,
                    categories: [],
                    enable: true
                });

                const CAB = new ButtonBuilder()
                    .setCustomId('createApplication')
                    .setLabel('Создать РП заявку')
                    .setStyle(ButtonStyle.Primary);

                const ARow = new ActionRowBuilder().addComponents(CAB);

                await aChannel.send({
                    content: 'Нажмите на кнопку ниже для создания персонажа',
                    components: [ARow]
                });

                await interaction.reply({
                    content: 'Рп настроенно',
                    flags: MessageFlags.Ephemeral
                });
                await SSettings();
                break;

            case 'add-rp-category':
                const cName = interaction.options.getString('название');
                const tChannel = interaction.options.getChannel('канал');
                const cRole = interaction.options.getRole('роль');

                const rpSettings = serverSettings.get(`${interaction.guildId}_rp`) || {
                    categories: []
                };

                rpSettings.categories.push({
                    name: cName.id,
                    channel: tChannel.id,
                    role: cRole.id
                });

                serverSettings.set(`${interaction.guildId}_rp`, rpSettings);

                await interaction.reply({
                    content: `Категория "${cName}" успешно добавлена!`,
                    flags: MessageFlags.Ephemeral
                });
        }
    } catch(error) {
        console.error(error);
        await interaction.reply({
            content: 'Произошла ошибка при выполении команды',
            flags: MessageFlags.Ephemeral
        });
    }
});


client.on(Events.InteractionCreate, async (interaction) => {
    if(!interaction.isButton() || interaction.customId !== 'verify') return;

    const settings = serverSettings.get(`${interaction.guildId}_verif_Channel`);
    if(!settings?.enabled) return;

    const modal = new ModalBuilder()
        .setCustomId('verif_modal')
        .setTitle('Верификация');

    const ageInput = new TextInputBuilder()
        .setCustomId('age')
        .setLabel('Ваш возраст')
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setMaxLength(3);

    const purposeInput = new TextInputBuilder()
        .setCustomId('purpose')
        .setLabel('Цель на сервере')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
        .setMaxLength(200);

    const nameInput = new TextInputBuilder()
        .setCustomId('name')
        .setLabel('Ваше имя')
        .setStyle(TextInputStyle.Short)
        .setMaxLength(25)
        .setRequired(true);

    const yourselfInput = new TextInputBuilder()
        .setCustomId('yourself')
        .setLabel('Расскажите о себе')
        .setStyle(TextInputStyle.Paragraph)
        .setMaxLength(300)
        .setRequired(true);

    const communityInput = new TextInputBuilder()
        .setCustomId('community')
        .setLabel('Как вы относитесь к комьюнити?')
        .setStyle(TextInputStyle.Paragraph)
        .setMaxLength(250)
        .setRequired(true);

    
    if(!settings.Com){
        modal.addComponents(
            new ActionRowBuilder().addComponents(ageInput),
            new ActionRowBuilder().addComponents(nameInput),
            new ActionRowBuilder().addComponents(yourselfInput),
            new ActionRowBuilder().addComponents(purposeInput)
        );
    } else {
        modal.addComponents(
            new ActionRowBuilder().addComponents(ageInput),
            new ActionRowBuilder().addComponents(nameInput),
            new ActionRowBuilder().addComponents(yourselfInput),
            new ActionRowBuilder().addComponents(purposeInput),
            new ActionRowBuilder().addComponents(communityInput)
        );
    }

    await interaction.showModal(modal);
});

client.on(Events.InteractionCreate, async (interaction) => {
    if(!interaction.isButton()) return;


    const settings = serverSettings.get(`${interaction.guildId}_rp`);
    if(!settings?.enabled) return;

    const modal = new ModalBuilder()
        .setCustomId('rp_modal')
        .setTitle('Рп заявка');

    const nameInput = new TextInputBuilder()
        .setCustomId('character_name')
        .setLabel('Имя персонажа')
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setMinLength(2);

    const descriptionInput = new TextInputBuilder()
        .setCustomId('description')
        .setLabel('Описание персонажа')
        .setRequired(true)
        .setStyle(TextInputStyle.Paragraph)
        .setMaxLength(500);

    const skillInput = new TextInputBuilder()
        .setCustomId('skill')
        .setLabel('Способности персонажа')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

    modal.addComponents(
        new ActionRowBuilder().addComponents(nameInput),
        new ActionRowBuilder().addComponents(descriptionInput),
        new ActionRowBuilder().addComponents(skillInput)
    );

    await interaction.showModal(modal);

});

client.on(Events.InteractionCreate, async (interaction) => {
    if(!interaction.isModalSubmit()) return;
    
    try{
        switch(interaction.customId){
            case 'verif_modal':
                const verif_settings = serverSettings.get(`${interaction.guildId}_verif_Channel`)
                if(!verif_settings?.enabled) return;

                const age = interaction.fields.getTextInputValue('age');
                const name = interaction.fields.getTextInputValue('name');
                const yourself = interaction.fields.getTextInputValue('yourself')
                const purpose = interaction.fields.getTextInputValue('purpose')

                let community = "сервер не сообщество"
                if(verif_settings.Com){
                    try{
                        community = interaction.fields.getTextInputValue('community') || 'Сервер не сообщество';
                    }catch {
                        community = 'ошибка';
                    }
                }
                const verif_embed = new EmbedBuilder()
                    .setColor('DarkRed')
                    .setTitle('Анкета на верификацию')
                    .setThumbnail(
                        interaction.user.displayAvatarURL({
                            dynamic: true,
                            size: 1024,
                        }),
                    )
                    .addFields(
                        { name: "Возраст", value: age },
                        { name: "Имя", value: name },
                        { name: "О себе", value: yourself },
                        { name: "Цели на сервере", value: purpose },
                        { name: "Отношение к сообществу", value: community }
                    )
                    .setFooter({ text: `ID Пользователя: ${interaction.user.id} Имя пользователя: ${interaction.user.username}`});
                
                const verifButtons = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`verify_accept_${interaction.user.id}`)
                            .setLabel('Принять')
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId(`verify_reject_${interaction.user.id}`)
                            .setLabel('Отклонить')
                            .setStyle(ButtonStyle.Danger)
                    );
                const logsChannel = interaction.guild.channels.cache.get(verif_settings.lChannel);
                await logsChannel.send({ embeds: [verif_embed], components: [verifButtons] });

                await interaction.reply({
                    content: "Ваша заявка отправлена на рассмотение",
                    flags: MessageFlags.Ephemeral
                });
                break;

            case 'rp_modal':
                const rpSettings = serverSettings.get(`${interaction.guildId}_rp`)
                if(!rpSettings?.enabled) return;

                const charName = interaction.fields.getTextInputValue('character_name');
                const charDescription = interaction.fields.getTextInputValue('description');
                const charSkills = interaction.fields.getTextInputValue('skill');

                const rpEmber = new EmbedBuilder()
                    .setColor('Red')
                    .setTitle('Рп анкета')
                    .setThumbnail(
                        interaction.user.displayAvatarURL({
                            dynamic: true,
                            size: 1024,
                        }),
                    )
                    .addFields(
                        { name: "Имя персонажа", value: charName },
                        { name: "Описание персонажа", value: charDescription },
                        { name: "навыки персонажа", value: charSkills }
                    )
                    .setFooter({ text: `ID Пользователя ${interaction.user.id} Ник пользователя ${interaction.user.username}`})

                    const rpButton = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(`rp_accept_${interaction.user.id}`)
                                .setLabel('Принять')
                                .setStyle(ButtonStyle.Success),

                            new ButtonBuilder()
                                .setCustomId(`rp_reject_${interaction.user.id}`)
                                .setLabel('Отклонить')
                                .setStyle(ButtonStyle.Danger)
                        )
                        
                break;

        }
    }catch (error){
        console.error(error);
        await interaction.reply({
            content: 'Произошла ошибка при обработке запроса',
            flags: MessageFlags.Ephemeral
        });
    }
});

client.on(Events.InteractionCreate, async (interaction) => {
    if(!interaction.isButton()) return;
    try {
        if(interaction.customId.startsWith('verify_')){
            const [action, type, userId] = interaction.customId.split('_');
            const settings = serverSettings.get(`${interaction.guildId}_verif_Channel`);
            const member = await interaction.guild.members.fetch(userId);

            if(type === 'accept') {
                await member.roles.add(settings.vRole);
                await member.roles.remove(settings.rRole);
                await interaction.reply({
                    content: `Пользователь ${member.user.tag} верифицирован`,
                    flags: MessageFlags.Ephemeral
                });
            } else if(type === 'reject') {
                await member.send('Ваша заявка на вступление была отклонена');
                await interaction.reply({
                    content: `Пользователь ${member.user.tag} отклонен`,
                    flags: MessageFlags.Ephemeral
                });
            }
        }
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: 'произошла ошибка взаимодействия',
            flags: MessageFlags.Ephemeral
        });
    }
});

client.login(TOKEN);

