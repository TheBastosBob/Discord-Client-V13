const {getServerList} = require("../servers");
const {printMessages} = require("../messages");
const { Client, CustomStatus, VoiceChannel } = require('discord.js-selfbot-v13');
const BotController = require("./BotController");

class ClientBot {
    constructor(options) {
        this.client = new Client(
            {
                readyStatus: false,
                patchVoice: true,
            });
        this.options = options;
        this.id = options.id;
        this.controller = new BotController(this.client);
    }

    async start() {
        this.client.on('ready', () => {
            console.log(`${this.client.user.username} is ready!`)
        });
        await this.client.login(this.options.token);
    }
}

module.exports = ClientBot;
