
async function printMessages(channel) {
    const messages = await channel.messages.fetch({limit: 100})
    //json to array reverse order
    const messagesArray = JSON.parse(JSON.stringify(messages)).reverse()
    //print to format : [time] [Author] [message] [messageID]
    messagesArray.map(message => {
        const date = new Date(message.createdTimestamp)
        console.log(`[${date.toLocaleString()}] [${message.authorId}] [${message.content}] [${message.id}]`)
    })
}


module.exports = {
    printMessages
}
