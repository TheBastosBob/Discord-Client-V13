const { joinVoiceChannel } = require('@discordjs/voice');
const ChannelPlayer = require("./ChannelPlayer");
const {RelationshipManager} = require("discord.js-selfbot-v13");

class BotController {

    constructor(client) {
        this.targetServer = null;
        this.targetChannel = null;
        this.targetUser = null;
        this.targetVoiceChannel = null;
        this.targetFriend = null;
        this.client = client;
        this.playerController = new ChannelPlayer();
        this.relationships = new RelationshipManager(this.client);
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



}

module.exports = BotController;
