import { openai } from './openai.js'
import { code } from 'telegraf/format'

const MAX_CONVERSATION_LENGTH = 9

export const INITIAL_SESSION = {
  messages: [],
}

export async function processTextToChat(ctx, content) {
  try {
    ctx.session.messages.push({ role: openai.roles.USER, content })

    const response = await openai.chat(ctx.session.messages)

    ctx.session.messages.push({
      role: openai.roles.ASSISTANT,
      content: response.content,
    })

    await ctx.reply(response.content)
  } catch (e) {
    console.log('Ошибка при получении ответа от сервера OpenAI: ', e.message)
  }
}

export async function removeContextLimit(ctx) {
  ctx.session ??= INITIAL_SESSION
  if (ctx.session.messages.length > MAX_CONVERSATION_LENGTH) {
    ctx.session = {
      messages: [],
    }
    ctx.reply(code('К сожалению мне пришлось сбросить контекст предыдущих сообщений по причине того, что был превышен лимит.'))
  }
}