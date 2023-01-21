
//function to get the server list
async function getServerList(client) {
    //get the servers
    const servers = await client.guilds.fetch()
    //get the server names
    const serverNames = servers.map(server => server.name)
    //return the server names
    return serverNames
}

module.exports = {
    getServerList
}
