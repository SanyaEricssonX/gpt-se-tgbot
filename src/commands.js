import { code } from 'telegraf/format'

export async function initCommandStart(ctx) {
  await ctx.reply(`Рад приветствовать вас!
Я - GPT SanyaEricssonX Edition.
Я работаю как с текстовыми, так и с голосовыми сообщениями.
  
Список команд, которые
могут вам пригодиться:
/start - основная информация
/profile - ваш профиль
/deletecontext - сбросить контекст сообщений

Уже не терпится помочь вам - спрашивайте!`)
}

export async function initCommandDelCtx(ctx) {
  //сброс контекста
  ctx.session = {
    messages: [],
  }
  await ctx.reply(code('Контекст был сброшен успешно.'))
}

export async function initCommandProfile(ctx) {
  await ctx.reply(code('В данный момент здесь нет ничего интересного, но скоро будет!'))
}