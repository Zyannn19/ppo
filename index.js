require('dotenv').config();
const { Telegraf } = require('telegraf');
const { parseHashtagCommand } = require('./parser');
const { TikTokAutomation } = require('./tiktok');
const { randomDelay } = require('./delay');

const bot = new Telegraf(process.env.BOT_TOKEN);

// Debug semua pesan masuk
bot.on('text', (ctx) => {
  console.log("MASUK:", ctx.message.text);
});

// Start command
bot.start((ctx) => {
  ctx.reply('🤖 Bot aktif\n\nFormat:\n/hashtag tag|komen|jumlah\n\nContoh:\n/hashtag moots|mau dong|1');
});

// FIX: pakai hears biar ga miss
bot.hears(/^\/hashtag/i, async (ctx) => {
  const text = ctx.message.text;
  const parsed = parseHashtagCommand(text);

  if (!parsed) {
    return ctx.reply('❌ Format salah.\n\nContoh:\n/hashtag moots|mau dong|1');
  }

  ctx.reply(`🔍 Cari hashtag #${parsed.tag}...`);

  const tiktok = new TikTokAutomation();

  try {
    await tiktok.init();

    const videos = await tiktok.collectVideoUrls(parsed.tag, parsed.jumlah);

    if (videos.length === 0) {
      return ctx.reply('⚠️ Ga nemu video.');
    }

    let success = 0;

    for (let i = 0; i < videos.length; i++) {
      ctx.reply(`💬 Proses video ${i + 1}/${videos.length}`);

      const res = await tiktok.commentOnVideo(videos[i], parsed.comment);

      if (res) success++;

      await randomDelay(10000, 15000); // delay 10-15 detik
    }

    ctx.reply(`✅ Selesai: ${success}/${videos.length}`);
    await tiktok.close();

  } catch (err) {
    console.error(err);
    ctx.reply(`❌ Error: ${err.message}`);
    await tiktok.close();
  }
});

bot.launch();
console.log('🤖 Bot jalan...');
