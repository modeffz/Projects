const { Client, GatewayIntentBits, SlashCommandBuilder } = require('discord.js');
require('dotenv').config(); // Загружаем переменные окружения

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ],
});

// Команда /ping
const pingCommand = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Replies with Pong!');

// Команда /number
const randomN = new SlashCommandBuilder()
  .setName('number')
  .setDescription('Генерация случайного числа')
  .addIntegerOption(option =>
    option.setName('min')
      .setDescription('Минимальное значение')
      .setRequired(true))
  .addIntegerOption(option =>
    option.setName('max')
      .setDescription('Максимальное значение')
      .setRequired(true));

// Команда /8ball
const ball = new SlashCommandBuilder()
  .setName('8ball')
  .setDescription('Обычный шар предсказаний :3')
  .addStringOption(option =>
    option.setName('вопрос')
      .setDescription('Ваш вопрос')
      .setRequired(true));

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);

  // Регистрация команд на конкретном сервере
  await client.application.commands.create(pingCommand, process.env.GUILD_ID);
  await client.application.commands.create(randomN, process.env.GUILD_ID);
  await client.application.commands.create(ball, process.env.GUILD_ID);

  console.log('Commands registered!');
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === 'ping') {
    await interaction.reply('Pong!');
  } else if (commandName === 'number') {
    const min = options.getInteger('min');
    const max = options.getInteger('max');
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    await interaction.reply(`Случайное число: ${randomNumber}`);
  } else if (commandName === '8ball') {
    const responses = [
      'Да, конечно :3',
      'Да!',
      'Возможно, да',
      'Хотел бы знать...',
      'Скорее всего, нет',
      'Нет!',
      'Не могу сказать',
      'Спроси позже',
      'Вероятно, да',
      'Абсолютно нет!'
    ];
    const chance = Math.floor(Math.random() * responses.length);
    const why = options.getString('вопрос')
    await interaction.reply(`Вопрос: ${why} \n${responses[chance]}`);
  }
});

client.login(process.env.TOKEN); // Используем токен из .env
