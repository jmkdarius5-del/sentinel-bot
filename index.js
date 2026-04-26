const { Client, GatewayIntentBits, PermissionsBitField } = require("discord.js");
const fs = require("fs");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// load keys safely
function loadKeys() {
  return JSON.parse(fs.readFileSync("keys.json"));
}

// save keys
function saveKeys(data) {
  fs.writeFileSync("keys.json", JSON.stringify(data, null, 2));
}

// generate random key
function generateKey(length = 10) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let key = "";
  for (let i = 0; i < length; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const data = loadKeys();

  // PING
  if (interaction.commandName === "ping") {
    return interaction.reply("🏓 Pong!");
  }

  // GENKEY (ADMIN ONLY)
  if (interaction.commandName === "genkey") {
    if (!interaction.memberPermissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({ content: "❌ Admin only!", ephemeral: true });
    }

    const newKey = generateKey();
    data.validKeys.push(newKey);
    saveKeys(data);

    return interaction.reply({
      content: `🔑 Key: \`${newKey}\``,
      ephemeral: true
    });
  }

  // REDEEM
  if (interaction.commandName === "redeem") {
    const key = interaction.options.getString("key");

    if (!data.validKeys.includes(key)) {
      return interaction.reply("❌ Invalid key!");
    }

    if (data.usedKeys.includes(key)) {
      return interaction.reply("⚠️ Key already used!");
    }

    data.usedKeys.push(key);
    saveKeys(data);

    return interaction.reply("✅ Key redeemed!");
  }
});

client.login(process.env.TOKEN);
