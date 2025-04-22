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
    REST,
    Routes
} = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages, // Если планируете взаимодействия в личных сообщениях
    ],
});


const TOKEN = process.env.DISCORD_TOKEN;

client.once("ready", () => {
    console.log(`Bot is starting with a name ${client.user.tag}`);
    client.user.setPresence({
        activities: [{ name: "указания modeffz", type: 2 }], // 0 = Играет
        status: "dnd", // online | idle | dnd | invisible
    });
    client.guilds.cache.forEach(async (guild) => {
        try {
            const botMember = await guild.members.fetchMe();
            console.log(`Bot is present in guild: ${guild.name}`);
            console.log("Bot permissions:", botMember.permissions.toArray());
            console.log(
                "Bot roles:",
                botMember.roles.cache.map((role) => role.name).join(", "),
            );
        } catch (error) {
            console.error(
                `Ошибка при загрузке данных о боте на сервере ${guild.name}:`,
                error,
            );
        }
    });
});

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands('YOUR_CLIENT_ID', 'YOUR_GUILD_ID'),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'ping') {
    await interaction.reply('Pong!');
  }
});

client.login(TOKEN);
