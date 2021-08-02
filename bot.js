require('dotenv').config()
const { Telegraf } = require('telegraf')
const api = require('covid19-api');
const Markup = require('telegraf/markup');
const COUNTRIES_LIST = require('./constants')

// BOT_TOKEN =  This is the token that you will receive from BotFather in Telegram
const bot = new Telegraf(process.env.BOT_TOKEN); 
bot.start((ctx) => ctx.reply(`
Hello ${ctx.message.from.first_name}!
This bot will help you get statistics on the corona virus
Write the name of the country and get statistics on covid - 19.
If you do not know how to enter the name of the countries, then type the command /help .
`, 
  Markup.keyboard([
  ['Azerbaijan', 'Turkey'],
  ['Georgia', 'Russia']
])
.resize()
.extra()
));

bot.help((ctx) => ctx.reply(COUNTRIES_LIST))

bot.on('text', async (ctx) => {
  let data = {};
  try {
      data = await api.getReportsByCountries(ctx.message.text);
      const formatData = `
Country  : ${data[0][0].country}
Cases  : ${data[0][0].cases}
Deaths  : ${data[0][0].deaths}
Recovered  : ${data[0][0].recovered}
  `;
      // Flag : ${data[0][0].flag}
      ctx.reply(formatData)
  } catch {
    console.log('You made a mistake');
    ctx.reply('You entered the wrong country name, enter the command /help To get acquainted with the names of the countries');
  }

});

bot.launch()
console.log('Bot launched');


// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))