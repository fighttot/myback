import linebot from 'linebot'
import { line, lineasner } from '../controllers/products.js'

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

bot.on('message', async (event) => {
  if (event.message.type === 'text' && event.message.text === '最新商品') {
    try {
      const message = await line(event)
      event.reply(message)
    } catch (error) {
      console.log(error)
    }
  } else if (event.message.type === 'text' && event.message.text === '熱門商品') {
    try {
      const message = await lineasner(event)
      event.reply(message)
    } catch (error) {
      console.log(error)
    }
  }
})

export default bot
