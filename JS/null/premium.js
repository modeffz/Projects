const { Client, GatewayIntentBits, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
    console.log(`Бот запущен как ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {

    if (message.content === '/premium') {
        const premiumButton = new ButtonBuilder()
            .setCustomId('premium_button')
            .setLabel('Получить Nitro')
            .setStyle(ButtonStyle.Premium);

        const row = new ActionRowBuilder().addComponents(premiumButton);

        await message.reply({
            content: 'Хотите получить Nitro?',
            components: [row],
        });
    }

    if (message.isButton() && interaction.customId === 'premium_button') {
        await message.reply('Вы нажали на премиум-кнопку!');
    }
});

client.login('MTM1MTE4OTEzMjc1OTc5MzY5NA.GcAiyg.RS-TjBvm6c6Wc0-s0rtcqVH9BCFRwAiHuv_k4E');
