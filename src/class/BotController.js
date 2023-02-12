const { joinVoiceChannel } = require('@discordjs/voice');
const ChannelPlayer = require("./ChannelPlayer");
const {RelationshipManager} = require("discord.js-selfbot-v13");

class BotController {

    constructor(client) {
        this.targetServer = null;
        this.targetChannel = null;
        this.targetUser = null;
        this.targetVoiceChannel = null;
        this.voiceState = null;
        this.targetFriend = null;
        this.client = client;
        this.playerController = new ChannelPlayer();
        this.relationships = new RelationshipManager(this.client);
        this.commandListener();
        this.callResponder();
    }

    set targetServer(server) {
        this._targetServer = server;
    }

    set targetChannel(channel) {
        this._targetChannel = channel;
    }

    set targetFriend(userName) {
        this._targetFriend = userName;
    }

    get targetFriend() {
        return this._targetFriend;
    }

    set targetUser(user) {
        this._targetUser = user;
    }

    get targetServer() {
        return this._targetServer;
    }

    set voiceState(state) {
        this._voiceState = state;
    }

    get voiceState() {
        return this._voiceState;
    }

    get targetChannel() {
        return this._targetChannel;
    }

    get targetUser() {
        return this._targetUser;
    }

    setTargetServer(serverName) {
        const server = this.client.guilds.cache.find(server => server.name === serverName);
        if (server) {
            this.targetServer = server;
        } else {
            console.log('Server does not exist')
        }
    }

    setTargetChannel(channelName) {
        const channel = this.targetServer.channels.cache.find(channel => channel.name === channelName)
        if (channel.type === 'GUILD_TEXT') {
            this.targetChannel = channel;
        } else {
            console.log('Channel is not a text channel or does not exist')
        }
    }

    setTargetUser(userName) {
        const user = this.client.users.cache.find(user => user.username === userName)
        if (user) {
            this.targetUser = user;
        } else {
            console.log('User does not exist')
        }
    }

    setTargetVoiceChannel(channelName) {
        try {
            const channel = this.targetServer.channels.cache.find(channel => channel.name === channelName)
            if (channel.type === 'GUILD_VOICE') {
                this.targetVoiceChannel = channel;
            } else {
                console.log('Channel is not a voice channel or does not exist')
            }
        } catch (error) {
            console.log('No server selected')
        }
    }

    setTargetFriend(userName) {
        const friend = this.client.users.cache.find(user => user.username === userName)
        if (friend) {
            this.targetFriend = friend;
        } else {
            console.log('User does not exist')
        }
    }

    callFriend() {
        try {
            if (this.targetUser) {
                //create dm channel
                this.targetUser.createDM().then(async (channel) => {
                    this.voiceConnection = await channel.call();
                })
            } else {
                console.log('No friend selected')
            }
        } catch (error) {
            console.log('Error: ' + error)
        }
    }

    endCall() {
        try {
            if (this.voiceConnection) {
                console.log(this.voiceConnection)
                this.voiceConnection.destroy();
            }
        } catch (error) {
            console.log('Error: ' + error)
        }
    }

    inviteFriend() {

    }

    connectToVoiceChannel() {
        try {
            if (this.targetVoiceChannel) {
                if (this.targetVoiceChannel.joinable) {
                    this.voiceConnection = joinVoiceChannel(
                        {
                            channelId: this.targetVoiceChannel.id,
                            guildId: this.targetVoiceChannel.guild.id,
                            adapterCreator: this.targetVoiceChannel.guild.voiceAdapterCreator,
                        });
                } else {
                    console.log('Cannot join channel')
                }
            } else {
                console.log('No voice channel selected')
            }
        } catch (error) {
            console.log('Error: ' + error)
        }
    }

    disconnectFromVoiceChannel() {
        try {
            this.voiceConnection.destroy();
        } catch (error) {
            console.log('Error: ' + error)
        }
    }

    play(url) {
        try {
            if (this.voiceConnection) {
                this.playerController.voiceConnection = this.voiceConnection;
                this.playerController.play(url);
            }
        } catch (error) {
            console.log('Error: ' + error)
        }
    }

    stop() {
        this.playerController.stop();
    }

    pause() {
        this.playerController.pauseMusic();
    }

    callResponder() {
        //if the bot receives a call accept it
        this.client.on('voiceStateUpdate', (oldState, newState) => {
            console.log(newState.channelId)
            if (newState.channelId && !oldState.channelId) {
                if (newState.channel.type === 'DM' || newState.channel.type === 'GROUP_DM') {
                    newState.channel.call().then(connection => {
                        this.voiceConnection = connection;
                    })
                }
            }
        })
    }

    commandListener() {
        //listen commands from direct messages
        this.client.on('messageCreate', async (message) => {
            if (message.channel.type === 'DM' && message.author.id === process.env.USER_ID) {
                //commands
                if (message.content.startsWith('!')) {
                    const command = message.content.split(' ')[0].substring(1);
                    const args = message.content.split(' ').slice(1);
                    switch (command) {
                        case 'server':
                            this.setTargetServer(args[0]);
                            break;
                        case 'channel':
                            this.setTargetChannel(args[0]);
                            break;
                        case 'user':
                            this.setTargetUser(args[0]);
                            break;
                        case 'voice':
                            this.setTargetVoiceChannel(args[0]);
                            break;
                        case 'friend':
                            this.setTargetFriend(args[0]);
                            break;
                        case 'call':
                            this.callFriend();
                            break;
                        case 'end':
                            this.endCall();
                            break;
                        case 'invite':
                            this.inviteFriend();
                            break;
                        case 'connect':
                            this.connectToVoiceChannel();
                            break;
                        case 'disconnect':
                            this.disconnectFromVoiceChannel();
                            break;
                        case 'play':
                            this.play(args[0]);
                            break;
                        case 'stop':
                            this.stop();
                            break;
                        case 'pause':
                            this.pause();
                            break;
                        default:
                            console.log('Command not found')
                    }
                }
            }
        })
    }
}

module.exports = BotController;
