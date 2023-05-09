import { Telegraf, session } from 'telegraf'
import { message } from 'telegraf/filters'
import { code } from 'telegraf/format'
import config from 'config'
import { ogg } from './oggToMp3.js'
import { removeFile } from './rmVoiceMsg.js'
import { openai } from './openai.js'
import { initCommandStart, initCommandDelCtx, initCommandProfile } from './commands.js'
import { processTextToChat, INITIAL_SESSION, removeContextLimit } from './response.js'

console.log(config.get('TEST_ENV'))

const bot = new Telegraf(config.get('TELEGRAM_TOKEN'))

bot.use(session())

// Команды
bot.command('start', initCommandStart)

bot.command('deletecontext', initCommandDelCtx)

bot.command('profile', initCommandProfile)

// Обработка текстовых сообщений, отправленных пользователем
bot.on(message('text'), async (ctx) => {
  ctx.session ??= INITIAL_SESSION
  try {
    let tempmsg = await ctx.reply(code('Отправляю ваш запрос на сервер, пожалуйста подождите'))
    await processTextToChat(ctx, ctx.message.text)
    bot.telegram.deleteMessage(ctx.chat.id, tempmsg.message_id) // Удаляем временное сообщение
    removeContextLimit(ctx)
  } catch (e) {
    console.log(`Ошибка сервера OpenAI при работе с текстовым сообщением пользователя: `, e.message)
  }
})

// Обработка голосовых сообщений, отправленных пользователем
bot.on(message('voice'), async (ctx) => {
  ctx.session ??= INITIAL_SESSION
  try {
    await ctx.reply(code('Отправляю ваш запрос на сервер, пожалуйста подождите'))
    const voiceMsgLink = await ctx.telegram.getFileLink(ctx.message.voice.file_id)
    const userId = String(ctx.message.from.id)
    const oggPath = await ogg.create(voiceMsgLink.href, userId)
    const mp3Path = await ogg.toMp3(oggPath, userId)

    removeFile(oggPath)

    const text = await openai.transcription(mp3Path)
    await ctx.reply(code(`Ваше сообщение: ${text}`))

    await processTextToChat(ctx, text)
  } catch (e) {
    console.log(`Ошибка сервера OpenAI при работе с голосовым сообщением пользователя: `, e.message)
  }
})

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
