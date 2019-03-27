import TelegramBot from 'node-telegram-bot-api';
const TOKEN = '670943276:AAG79PnY2E5fDgDbxCi46pZlhgktkv7rTok';
// const socket = new WebSocket("ws://pikabu.ru/ws");
// console.log(socket);
// socket.onopen = () => {
//   alert("Соединение установлено.");
// };


console.log('Bot has been started ....')
let counter = Math.floor(Math.random() * 1234);
const bot = new TelegramBot(TOKEN, {
  polling: {
    interval: 300,
    autoStart: true,
    params: {
      timeout: 10
    }
  }
})

bot.onText(/\/start/, msg => {
  const { id } = msg.chat

  bot.sendMessage(msg.chat.id, `Привет, ${msg.from.first_name}!`);
  console.log(msg)
})

bot.on('message', msg => {
  console.log(msg);
})
