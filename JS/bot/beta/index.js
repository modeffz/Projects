require("dotenv").config();
const {
    Client,
    GatewayIntentBits,
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    StringSelectMenuBuilder,
    Events,
    SlashCommandBuilder,
} = require("discord.js");
const fs = require('fs').promises;

// Структура для хранения настроек серверов
const serverSettings = new Map();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages,
    ],
});

// Команды для настройки
const setupCommands = [
    new SlashCommandBuilder()
        .setName('setup-verification')
        .setDescription('Настройка верификации')
        .addChannelOption(option => 
            option.setName('verification_channel')
            .setDescription('Канал для верификации')
            .setRequired(true))
        .addChannelOption(option => 
            option.setName('logs_channel')
            .setDescription('Канал для логов')
            .setRequired(true))
        .addRoleOption(option => 
            option.setName('verified_role')
            .setDescription('Роль после верификации')
            .setRequired(true)),

    new SlashCommandBuilder()
        .setName('setup-roleplay')
        .setDescription('Настройка РП системы')
        .addChannelOption(option => 
            option.setName('application_channel')
            .setDescription('Канал для заявок')
            .setRequired(true))
        .addChannelOption(option => 
            option.setName('review_channel')
            .setDescription('Канал для рассмотрения')
            .setRequired(true)),
            
    new SlashCommandBuilder()
        .setName('add-rp-category')
        .setDescription('Добавить РП категорию')
        .addStringOption(option => 
            option.setName('name')
            .setDescription('Название категории')
            .setRequired(true))
        .addChannelOption(option => 
            option.setName('channel')
            .setDescription('Канал категории')
            .setRequired(true))
        .addRoleOption(option => 
            option.setName('role')
            .setDescription('Роль для категории')
            .setRequired(true))
];

// Функции для работы с настройками
async function loadSettings() {
    try {
        const data = await fs.readFile('settings.json', 'utf8');
        const settings = JSON.parse(data);
        for (const [key, value] of Object.entries(settings)) {
            serverSettings.set(key, value);
        }
        console.log('Настройки успешно загружены');
    } catch (error) {
        if (error.code === 'ENOENT') {
            await saveSettings(); // Создаем пустой файл, если он не существует
            console.log('Создан новый файл настроек');
        } else {
            console.error('Ошибка при загрузке настроек:', error);
        }
    }
}

async function saveSettings() {
    try {
        const settings = Object.fromEntries(serverSettings);
        await fs.writeFile('settings.json', JSON.stringify(settings, null, 2));
        console.log('Настройки успешно сохранены');
    } catch (error) {
        console.error('Ошибка при сохранении настроек:', error);
    }
}

client.once("ready", async () => {
    console.log(`Бот ${client.user.tag} запущен`);
    
    await loadSettings(); // Загружаем настройки при запуске

    try {
        await client.application.commands.set(setupCommands, process.env.GUILD_ID);
        console.log("Slash-команды зарегистрированы");
    } catch (error) {
        console.error("Ошибка регистрации команд:", error);
    }
});

// Обработка команд настройки
client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isCommand()) return;

    try {
        switch (interaction.commandName) {
            case 'setup-verification':
                const verificationChannel = interaction.options.getChannel('verification_channel');
                const logsChannel = interaction.options.getChannel('logs_channel');
                const verifiedRole = interaction.options.getRole('verified_role');

                serverSettings.set(`${interaction.guildId}_verification`, {
                    verificationChannelId: verificationChannel.id,
                    logsChannelId: logsChannel.id,
                    verifiedRoleId: verifiedRole.id,
                    enabled: true
                });

                // Отправляем сообщение с кнопкой верификации
                const verifyButton = new ButtonBuilder()
                    .setCustomId('verify')
                    .setLabel('Пройти верификацию')
                    .setStyle(ButtonStyle.Primary);

                const row = new ActionRowBuilder().addComponents(verifyButton);

                await verificationChannel.send({
                    content: 'Нажмите на кнопку ниже, чтобы пройти верификацию',
                    components: [row]
                });

                await interaction.reply({
                    content: 'Система верификации успешно настроена!',
                    ephemeral: true
                });
                await saveSettings();
                break;

            case 'setup-roleplay':
                const applicationChannel = interaction.options.getChannel('application_channel');
                const reviewChannel = interaction.options.getChannel('review_channel');

                serverSettings.set(`${interaction.guildId}_roleplay`, {
                    applicationChannelId: applicationChannel.id,
                    reviewChannelId: reviewChannel.id,
                    categories: [],
                    enabled: true
                });

                // Отправляем сообщение с кнопкой создания заявки
                const createApplicationButton = new ButtonBuilder()
                    .setCustomId('create_application')
                    .setLabel('Создать РП заявку')
                    .setStyle(ButtonStyle.Primary);

                const applicationRow = new ActionRowBuilder().addComponents(createApplicationButton);

                await applicationChannel.send({
                    content: 'Нажмите на кнопку ниже, чтобы создать заявку на РП персонажа',
                    components: [applicationRow]
                });

                await interaction.reply({
                    content: 'Система РП заявок успешно настроена!',
                    ephemeral: true
                });
                await saveSettings();
                break;

            case 'add-rp-category':
                const categoryName = interaction.options.getString('name');
                const categoryDescription = interaction.options.getString('description');
                
                const rpSettings = serverSettings.get(`${interaction.guildId}_roleplay`) || {
                    categories: []
                };

                rpSettings.categories.push({
                    name: categoryName,
                    description: categoryDescription
                });

                serverSettings.set(`${interaction.guildId}_roleplay`, rpSettings);

                await interaction.reply({
                    content: `Категория "${categoryName}" успешно добавлена!`,
                    ephemeral: true
                });
                await saveSettings();
                break;
        }
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: 'Произошла ошибка при выполнении команды',
            ephemeral: true
        });
    }
});

// Обработка верификации
client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isButton() || interaction.customId !== 'verify') return;

    const settings = serverSettings.get(`${interaction.guildId}_verification`);
    if (!settings?.enabled) return;

    const modal = new ModalBuilder()
        .setCustomId('verification_modal')
        .setTitle('Верификация');

    // Добавьте необходимые поля в модальное окно
    const ageInput = new TextInputBuilder()
        .setCustomId('age')
        .setLabel('Ваш возраст')
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setMaxLength(3); // Ограничение по символам

    const purposeInput = new TextInputBuilder()
        .setCustomId('purpose')
        .setLabel('Цель на сервере')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
        .setMaxLength(200); // Ограничение по символам

    const additionalInfoInput = new TextInputBuilder()
        .setCustomId('additional_info')
        .setLabel('Дополнительная информация')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(false)
        .setMaxLength(300); // Ограничение по символам

    modal.addComponents(
        new ActionRowBuilder().addComponents(ageInput),
        new ActionRowBuilder().addComponents(purposeInput),
        new ActionRowBuilder().addComponents(additionalInfoInput)
    );

    await interaction.showModal(modal);
});

// Обработка РП заявок
client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isButton() || interaction.customId !== 'create_application') return;

    const settings = serverSettings.get(`${interaction.guildId}_roleplay`);
    if (!settings?.enabled) return;

    const modal = new ModalBuilder()
        .setCustomId('roleplay_modal')
        .setTitle('РП заявка');

    // Добавьте необходимые поля в модальное окно
    const nameInput = new TextInputBuilder()
        .setCustomId('character_name')
        .setLabel('Имя персонажа')
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setMaxLength(50); // Ограничение по символам

    const descriptionInput = new TextInputBuilder()
        .setCustomId('character_description')
        .setLabel('Описание персонажа')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
        .setMaxLength(500); // Ограничение по символам

    modal.addComponents(
        new ActionRowBuilder().addComponents(nameInput),
        new ActionRowBuilder().addComponents(descriptionInput)
    );

    await interaction.showModal(modal);
});

// Обработка отправки модальных окон
client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isModalSubmit()) return;

    try {
        switch (interaction.customId) {
            case 'verification_modal':
                const verificationSettings = serverSettings.get(`${interaction.guildId}_verification`);
                if (!verificationSettings?.enabled) return;

                const age = interaction.fields.getTextInputValue('age');
                const purpose = interaction.fields.getTextInputValue('purpose');
                const additionalInfo = interaction.fields.getTextInputValue('additional_info');

                const verificationEmbed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle('Заявка на верификацию')
                    .setAuthor({ name: interaction.user.tag })
                    .addFields(
                        { name: 'Возраст', value: age },
                        { name: 'Цель', value: purpose },
                        { name: 'Дополнительная информация', value: additionalInfo || 'Не указано' }
                    )
                    .setFooter({ text: `ID: ${interaction.user.id}` });

                const verificationButtons = new ActionRowBuilder()
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

                const logsChannel = interaction.guild.channels.cache.get(verificationSettings.logsChannelId);
                await logsChannel.send({ embeds: [verificationEmbed], components: [verificationButtons] });
                
                await interaction.reply({ 
                    content: 'Ваша заявка отправлена на рассмотрение', 
                    ephemeral: true 
                });
                break;

            case 'roleplay_modal':
                const rpSettings = serverSettings.get(`${interaction.guildId}_roleplay`);
                if (!rpSettings?.enabled) return;

                const charName = interaction.fields.getTextInputValue('character_name');
                const charDesc = interaction.fields.getTextInputValue('character_description');

                const rpEmbed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle('РП заявка')
                    .setAuthor({ name: interaction.user.tag })
                    .addFields(
                        { name: 'Имя персонажа', value: charName },
                        { name: 'Описание', value: charDesc }
                    )
                    .setFooter({ text: `ID: ${interaction.user.id}` });

                const categorySelect = new StringSelectMenuBuilder()
                    .setCustomId(`rp_category_${interaction.user.id}`)
                    .setPlaceholder('Выберите категорию РП')
                    .addOptions(
                        rpSettings.categories.map(category => ({
                            label: category.name,
                            value: category.channelId
                        }))
                    );

                const rpButtons = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`rp_accept_${interaction.user.id}`)
                            .setLabel('Принять')
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId(`rp_reject_${interaction.user.id}`)
                            .setLabel('Отклонить')
                            .setStyle(ButtonStyle.Danger)
                    );

                const reviewChannel = interaction.guild.channels.cache.get(rpSettings.reviewChannelId);
                await reviewChannel.send({ 
                    embeds: [rpEmbed], 
                    components: [new ActionRowBuilder().addComponents(categorySelect), rpButtons] 
                });
                
                await interaction.reply({ 
                    content: 'Ваша РП заявка отправлена на рассмотрение', 
                    ephemeral: true 
                });
                break;
        }
    } catch (error) {
        console.error(error);
        await interaction.reply({ 
            content: 'Произошла ошибка при обработке заявки', 
            ephemeral: true 
        });
    }
});

// Обработка кнопок верификации и РП
client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isButton()) return;

    try {
        if (interaction.customId.startsWith('verify_')) {
            const [action, type, userId] = interaction.customId.split('_');
            const settings = serverSettings.get(`${interaction.guildId}_verification`);
            const member = await interaction.guild.members.fetch(userId);

            if (type === 'accept') {
                await member.roles.add(settings.verifiedRoleId);
                await interaction.reply({ 
                    content: `Пользователь ${member.user.tag} верифицирован`, 
                    ephemeral: true 
                });
            } else if (type === 'reject') {
                await member.send('Ваша заявка на верификацию отклонена');
                await interaction.reply({ 
                    content: `Заявка пользователя ${member.user.tag} отклонена`, 
                    ephemeral: true 
                });
            }
        }

        if (interaction.customId.startsWith('rp_')) {
            const [action, type, userId] = interaction.customId.split('_');
            const settings = serverSettings.get(`${interaction.guildId}_roleplay`);
            const member = await interaction.guild.members.fetch(userId);

            if (type === 'accept') {
                // Ожидаем выбора категории
                await interaction.reply({ 
                    content: 'Выберите категорию РП для пользователя', 
                    ephemeral: true 
                });
            } else if (type === 'reject') {
                await member.send('Ваша РП заявка отклонена');
                await interaction.reply({ 
                    content: `РП заявка пользователя ${member.user.tag} отклонена`, 
                    ephemeral: true 
                });
            }
        }
    } catch (error) {
        console.error(error);
        await interaction.reply({ 
            content: 'Произошла ошибка при обработке действия', 
            ephemeral: true 
        });
    }
});

// Обработка выбора категории РП
client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isStringSelectMenu()) return;

    if (interaction.customId.startsWith('rp_category_')) {
        try {
            const userId = interaction.customId.split('_')[2];
            const settings = serverSettings.get(`${interaction.guildId}_roleplay`);
            const member = await interaction.guild.members.fetch(userId);
            const selectedCategory = settings.categories.find(c => c.channelId === interaction.values[0]);

            if (selectedCategory) {
                await member.roles.add(selectedCategory.roleId);
                await interaction.reply({ 
                    content: `Пользователь ${member.user.tag} добавлен в категорию ${selectedCategory.name}`, 
                    ephemeral: true 
                });
            }
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: 'Произошла ошибка при выборе категории', 
                ephemeral: true 
            });
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
