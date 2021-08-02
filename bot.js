require('dotenv').config()
const { Telegraf } = require('telegraf')
const api = require('covid19-api');
const Markup = require('telegraf/markup');
const COUNTRIES_LIST = require('./constants')

const bot = new Telegraf(process.env.BOT_TOKEN); // BOT_TOKEN - This is the token that you will receive from BotFather in Telegram
bot.start((ctx) => ctx.reply(`
Salam ${ctx.message.from.first_name}!
Koronavirus statistikanı oyrenin.
Ölkənin adını ingilis dilində daxil edin və statistikanı əldə edin.
Ölkələrin yazılışında çətinlik çəkirsinizsə onda /help komandasınnan istifadə edin.
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
Ölkə : ${data[0][0].country}
Ümumi yoluxanlar : ${data[0][0].cases}
Ölənlərin sayı : ${data[0][0].deaths}
Sağalanların sayı : ${data[0][0].recovered}
  `;
      // Flag : ${data[0][0].flag}
      ctx.reply(formatData)
  } catch {
    console.log('Owibka oldu qadan alem');
    ctx.reply('Qadan alem sef yazdın e eləbilki bidənə instruksiyanı yaxşı oxu sonra gəl, yada salamatı /help yaz');
  }

});

bot.launch()
console.log('Бот запущен');


// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))