import { openai } from './openai.js'

export const INITIAL_SESSION = {
  messages: [],
}

export async function initCommandDelCtx(ctx) {
  //сброс контекста
  ctx.session = {
    messages: [],
  }
  await ctx.reply('Контекст был сброшен успешно.')
}

export async function initCommandStart(ctx) {
  await ctx.reply(`Рад приветствовать вас!
Я - GPT SanyaEricssonX Edition.
Я работаю как с текстовыми, так и с голосовыми сообщениями.
  
Список команд, которые
могут вам пригодиться:
/myprofile     - основная информация о вашем профиле
/deletecontext - я забуду о чем мы говорили с вами ранее.

Уже не терпится помочь вам - спрашивайте!`)
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
