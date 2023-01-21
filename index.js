const { Client, CustomStatus } = require('discord.js-selfbot-v13');
const {getServerList} = require("./src/servers");
const BotController = require("./src/class/BotController");
const {printMessages} = require("./src/messages");
require('dotenv').config();



const client = new Client({
    // See other options here
    // https://discordjs-self-v13.netlify.app/#/docs/docs/main/typedef/ClientOptions
    // All partials are loaded automatically
    readyStatus: false,
});

const controller = new BotController(client);

client.on('ready', async () => {
    console.log(`${client.user.username} is ready!`);
    //rich presence
    const r = new CustomStatus()
        .setState('Binks to Binks')
        .setEmoji('💰')
    client.user.setActivity(r);
})



//get input from console
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

//constantantly check for input
readline.on('line', async (input) => {

    //split the input into an array
    const args = input.split(" ");
    //if input is 'exit' then exit
    if (args[0] === 'exit') {
        console.log('exiting...')
        process.exit()
    }
    if (args[0] === 'ping')
        console.log('pong')

    if (args[0] === 'servers')
        console.log(await getServerList(client))

    if (args[0] === 'server')
        console.log(controller.targetServer)

    if (args[0] === 'setserver') {
        controller.setTargetServer(args.slice(1).join(" "))
    }

    if (args[0] === 'channels')
        console.log(controller.targetServer.channels.cache.map(channel => channel.name))

    if (args[0] === 'channel')
        console.log(controller.targetChannel)

    if (args[0] === 'setchannel') {
        controller.setTargetChannel(args.slice(1).join(" "))
    }

    if (args[0] === 'users')
        console.log(controller.targetChannel.members.cache.map(user => user.user.username))

    if (args[0] === 'user')
        console.log(controller.targetUser)

    if (args[0] === 'setuser') {
        controller.setTargetUser(args.slice(1).join(" "))
    }

    if (args[0] === 'messages') {
        await printMessages(controller.targetChannel)
    }

    if (args[0] === 'message') {
        console.log(await controller.targetChannel.messages.fetch(args[1]))
    }

    if (args[0] === 'send') {
        controller.targetChannel.send(args.slice(1).join(" "))
    }

    if (args[0] === 'delete') {
        controller.targetChannel.messages.fetch(args[1]).then(message => message.delete())
    }

    if (args[0] === 'edit') {
        controller.targetChannel.messages.fetch(args[1]).then(message => message.edit(args.slice(2).join(" ")))
    }

})


client.login(process.env.DISCORD_TOKEN);

