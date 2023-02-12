const { Client, CustomStatus, VoiceChannel } = require('discord.js-selfbot-v13');
const { joinVoiceChannel } = require('@discordjs/voice');
const {getServerList} = require("./src/servers");
const BotController = require("./src/class/BotController");
const {printMessages} = require("./src/messages");
const ClientBot = require("./src/class/ClientBot");
require('dotenv').config();


const botTable = [];

const bot = new ClientBot({id: 'bot1', token: process.env.BINKS_TOKEN});
const bot2 = new ClientBot({id: 'bot2', token: process.env.DISCORD_TOKEN});
botTable.push(bot);
botTable.push(bot2);

bot.start();
bot2.start();


//
// const client = new Client({
//     // See other options here
//     // https://discordjs-self-v13.netlify.app/#/docs/docs/main/typedef/ClientOptions
//     // All partials are loaded automatically
//     readyStatus: false,
//     patchVoice: true,
// });

// const controller = new BotController(client);
//
// client.on('ready', async () => {
//     console.log(`${client.user.username} is ready!`);
//     //rich presence
//     const r = new CustomStatus()
//         .setState('Binks to Binks')
//         .setEmoji('💰')
//     client.user.setActivity(r);
// })
//
//
//
// //get input from console
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})






//
//constantantly check for input
readline.on('line', async (input) => {
    //split the input into an array
    const args = input.split(" ");
    //if input is 'exit' then exit
    if (args[0] === 'exit') {
        console.log('exiting...')
        process.exit()
    }
    if (args[0] === 'ping') {
        botTable.forEach(bot => {
            console.log(bot.client.ws.ping);
        })
    }

    if (args[0] === 'servers') {
        for (const bot1 of botTable) {
            console.log(await getServerList(bot1.client));
        }
    }

    if (args[0] === 'server')
        botTable.forEach(bot => {
            console.log(bot.controller.targetServer)
        })

    if (args[0] === 'setserver') {
        botTable.forEach(bot => {
            bot.controller.setTargetServer(args.slice(1).join(" "))
        })
    }

    if (args[0] === 'channels') {
        botTable.forEach(bot => {
            if (bot.controller.targetServer) {
                console.log(bot.controller.targetServer.channels.cache.map(channel => channel.name))
            } else {
                console.log('No server selected')
            }
        })
    }

    if (args[0] === 'channel') {
        botTable.forEach(bot => {
            console.log(bot.controller.targetChannel)
        })
    }

    if (args[0] === 'setchannel') {
        botTable.forEach(bot => {
            bot.controller.setTargetChannel(args.slice(1).join(" "))
        })
    }

    if (args[0] === 'voicechannels') {
        botTable.forEach(bot => {
            if (bot.controller.targetServer) {
                console.log(bot.controller.targetServer.channels.cache.filter(channel => channel.type === 'GUILD_VOICE').map(channel => channel.name))
            } else {
                console.log('No server selected')
            }
        })
    }

    if (args[0] === 'voicechannel') {
        botTable.forEach(bot => {
            console.log(bot.controller.targetVoiceChannel)
        })
    }

    if (args[0] === 'setvoicechannel') {
        botTable.forEach(bot => {
            bot.controller.setTargetVoiceChannel(args.slice(1).join(" "))
        })
    }

    if (args[0] === 'connect') {
        botTable.forEach(bot => {
            //timeout to prevent rate limit
            setTimeout(() => {
                bot.controller.connectToVoiceChannel()
            }, 1000)
        })
    }

    if (args[0] === 'disconnect') {
        botTable.forEach(bot => {
            bot.controller.disconnectFromVoiceChannel()
        })
    }


    if (args[0] === 'users') {
        botTable.forEach(bot => {
            console.log(bot.controller.users.cache.map(user => user.username))
        })
    }

    if (args[0] === 'user') {
        botTable.forEach(bot => {
            console.log(bot.controller.targetUser)
        })
    }

    if (args[0] === 'setuser') {
          botTable.forEach(bot => {
                bot.controller.setTargetUser(args.slice(1).join(" "))
            })
    }

    if (args[0] === 'messages') {
        botTable.forEach(bot => {
            printMessages(bot.controller.targetChannel)
        })
    }

    if (args[0] === 'message') {
        botTable.forEach(bot => {
            console.log(bot.controller.targetMessage)
        })
    }

    if (args[0] === 'send') {
        botTable.forEach(bot => {
            bot.controller.send(args.slice(1).join(" "))
        })
    }

    if (args[0] === 'delete') {
        botTable.forEach(bot => {
            bot.controller.targetChannel.messages.fetch(args[1]).then(message => message.delete())
        })
    }

    if (args[0] === 'edit') {
        botTable.forEach(bot => {
            bot.controller.targetChannel.messages.fetch(args[1]).then(message => message.edit(args.slice(2).join(" ")))
        })
    }

    //music

    if (args[0] === 'play') {
        //timeout to prevent rate limit
        botTable.forEach(bot => {
            setTimeout(() => {
                bot.controller.play(args.slice(1).join(" "))
            }, 1000)
        })
    }

    if (args[0] === 'stop') {
        botTable.forEach(bot => {
            bot.controller.stop()
        })
    }

    if (args[0] === 'pause') {
        botTable.forEach(bot => {
            bot.controller.pause()
        })
    }

    if (args[0] === 'resume') {
        botTable.forEach(bot => {
            bot.controller.resume()
        })
    }


    if (args[0] === 'call') {
        botTable.forEach(bot => {
            bot.controller.call(args.slice(1).join(" "))
        })
    }

    if (args[0] === 'endcall') {
        botTable.forEach(bot => {
            bot.controller.endCall()
        })
    }

    if (args[0] === 'voice') {
        botTable.forEach(bot => {
            console.log(bot.controller.voiceConnection)
        })
    }

    if (args[0] === 'dm') {
        botTable.forEach(bot => {
            bot.controller.targetUser.send(args.slice(1).join(" "))
        })
    }
})

