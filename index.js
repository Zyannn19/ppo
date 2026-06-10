require('dotenv').config();
const { Telegraf } = require('telegraf');
const { parseHashtagCommand } = require('./parser');
const { TikTokAutomation } = require('./tiktok');
const { randomDelay } = require('./delay');

const bot = new Telegraf(process.env.BOT_TOKEN);
const tasks = new Map();

bot.start(ctx => ctx.reply('Bot aktif. Pakai /hashtag tag|komen|jumlah'));

bot.command('stop', ctx => {
  tasks.delete(ctx.from.id);
  ctx.reply('Stopped.');
});

bot.command('hashtag', async ctx => {
  if (tasks.get(ctx.from.id)) return ctx.reply('Task running.');

  const parsed = parseHashtagCommand(ctx.message.text);
  if (!parsed) return ctx.reply('Format salah.');

  tasks.set(ctx.from.id, true);

  const t = new TikTokAutomation();
  await t.init();

  const vids = await t.collectVideoUrls(parsed.tag, parsed.jumlah);

  let ok = 0;
  for (let i = 0; i < vids.length; i++) {
    if (!tasks.get(ctx.from.id)) break;
    const res = await t.commentOnVideo(vids[i], parsed.comment);
    if (res) ok++;
    await randomDelay(8000, 15000);
  }

  await t.close();
  tasks.delete(ctx.from.id);
  ctx.reply(`Done ${ok}/${vids.length}`);
});

bot.launch();
console.log('Bot jalan...');
