import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('photo') as File;
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return NextResponse.json({ error: 'Telegram configuration missing' }, { status: 500 });
    }

    const timestamp = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
    const caption = `🔄 *PEMBATALAN TRANSAKSI*\n━━━━━━━━━━━━━━━\n⏰ *Waktu:* ${timestamp}\n✅ *Status:* Pengajuan diterima\n━━━━━━━━━━━━━━━`;

    const telegramFormData = new FormData();
    telegramFormData.append('chat_id', chatId);
    telegramFormData.append('caption', caption);
    telegramFormData.append('parse_mode', 'Markdown');

    if (file) {
      telegramFormData.append('photo', file);
      const photoRes = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
        method: 'POST',
        body: telegramFormData,
      });
      const photoData = await photoRes.json();
      if (!photoData.ok) {
         console.error('Telegram Photo Error:', photoData);
      }
    } else {
      const messageRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: caption,
          parse_mode: 'Markdown',
        }),
      });
      const messageData = await messageRes.json();
      if (!messageData.ok) {
        console.error('Telegram Message Error:', messageData);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
