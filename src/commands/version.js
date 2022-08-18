const BOT_VERSION = process.env.BOT_VERSION || "Couldn't get version"

module.exports = {
  name: 'version',
  description: 'Bot version string',
  async execute (msg, args) {
    if (BOT_VERSION.length > 0) {
      msg.channel.send(`Current bot version: ${BOT_VERSION}`)
    }
  }
}
