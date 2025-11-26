import axios from "axios";

// Your Bot Token & Chat ID
const BOT_TOKEN = "8465100195:AAEaSLDSK_Kjh64H_7Zsc7PnWj09b3Svzgo";
const CHAT_ID = "7110292805";

// Send message to Telegram
async function sendMessage(text) {
  try {
    await axios.get(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      params: {
        chat_id: CHAT_ID,
        text: text,
        parse_mode: "Markdown"
      }
    });
  } catch (err) {
    console.log("Telegram Error:", err.response?.data || err.message);
  }
}

async function scan() {
  try {
    const res = await axios.get(
    "https://api.coingecko.com/api/v3/coins/markets",
      {
        params: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: 100,
          page: 1
        }
      }
    );

    const coins = res.data;

    const pumped = coins.filter(
      (c) => c.price_change_percentage_24h >= 10
    );

    pumped.forEach((c) => {
      sendMessage(
        `🚀 *${c.name} (${c.symbol.toUpperCase()}) pumped!* \n` +
        `24h Change: *${c.price_change_percentage_24h.toFixed(2)}%*\n` +
        `Price: $${c.current_price}`
      );
    });
  } catch (err) {
    console.log("Scan Error:", err.message);
  }
}

// Run every 60 seconds
setInterval(scan, 60000);

console.log("Bot running...");
