const {createAudioPlayer, createAudioResource, NoSubscriberBehavior} = require("@discordjs/voice");
const play = require('play-dl');
class ChannelPlayer  {

constructor () {
    this.channel = null ;
    this.queue = [];
    this.player = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Play,
        }})
    this.pause = false ;
    this.Manager();
}

get voiceConnection ( ) {

return this._voiceConnection ;

}

set pause ( _pause ) {
    this._pause = _pause ;
}

get pause ( ) {
    return this._pause ;
}





set voiceConnection ( connection ) {
    this._voiceConnection = connection ;
}

get voiceChannel ( ) {

return this.channel ;

}

clearQueue ( ) {
    this.queue = [];
}

setQueue ( queue ) {
    this.queue = queue ;
}

addQueue ( song ) {
    this.queue.push(song)
}

getQueue ( ) {
    return this.queue ;
}

getPlayer ( ) {
    return this.player ;
}

setPlayer ( player ) {
    this.player = player ;
}

set channel ( channel ) {
    this._channel = channel ;
}

get channel ( ) {
    return this._channel ;
}

play (url) {

    try {
        console.log("play")
        play.stream(url, {
            discordPlayerCompatibility: true,
        }).then(async  (stream) => {
                const resource = await createAudioResource(stream.stream, {
                    inputType: stream.type,
                    inlineVolume: true
                });
                this.player.play(resource);
            }
        );
    } catch (e) {
        console.log(e)
        this.voiceConnection.channel.send("Error: " + e)
    }
    this.voiceConnection.subscribe(this.player);
}

async playYtdl(url) {
    const str = ytdl(url, {
        filter: "audioonly",
        quality: "highestaudio",
    })
    const resource = await createAudioResource(str, {
        inputType: str.type,
        inlineVolume: true
    });
    this.player.play(resource);
}

pauseMusic() {
    if (this.pause === false) {
        this.player.pause();
        this.pause = true;
    } else {
        this.player.unpause();
        this.pause = false;
    }
}

Manager() {
    this.player.on('error', error => {
        console.error(error);
    });

    this.player.on("stateChange", async (oldState, newState) => {
        if (newState.status === "idle") {
            console.log("idle")
            this.queue.shift();
            if (this.queue.length >= 1) {
                this.play(this.queue[0])
                this.queue.shift()
            } else {
                this.voiceConnection.disconnect();
            }
        }
    })
}

stop () {
    this.queue = [];
    this.player.stop();
    this.voiceConnection.disconnect();
}

    next ( ) {

        if (this.queue.length >= 1) {
            this.player.stop();
            this.play(this.queue[0])
        } else {
            this.player.stop();
            this.voiceConnection.disconnect();
        }
    }

}



module.exports = ChannelPlayer ;
