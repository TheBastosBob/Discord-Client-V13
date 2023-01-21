
function getChannelList(client) {
    const channels = client.channels.cache.map(channel => channel.name)
    return channels
}
