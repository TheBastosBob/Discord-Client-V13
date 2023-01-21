
class BotController {

    constructor(client) {
        this.targetServer = null;
        this.targetChannel = null;
        this.targetUser = null;
        this.client = client;
    }

    set targetServer(server) {
        this._targetServer = server;
    }

    set targetChannel(channel) {
        this._targetChannel = channel;
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
        if (channel) {
            this.targetChannel = channel;
        } else {
            console.log('Channel is not a text channel or does not exist')
        }
    }

    setTargetUser(userName) {
        const user = this.targetChannel.members.cache.find(user => user.user.username === userName)
        if (user) {
            this.targetUser = user;
        } else {
            console.log('User does not exist')
        }
    }

}

module.exports = BotController;
