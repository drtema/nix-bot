const TelegramBot = require('node-telegram-bot-api');
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

bot.onText(/\/help (.+)/, (msg, [source, match]) => {
  const { id } = msg.chat

  bot.sendMessage(id, debug(match))
  console.log(msg)
})

bot.onText(/\/howmuch (.+)/, (msg, [source, match]) => {
  bot.sendMessage(id, `Ярик отсосал ${counter} членов`)
  counter += Math.floor(counter * Math.random() * 10);
})

bot.on('/how_much', msg => {
  const { id } = msg.chat

  bot.sendMessage(id, `Ярик отсосал ${counter} членов`)
  counter += 1;
  console.log(msg)
})

bot.on('message', msg => {
  console.log(msg);
  if (!msg || msg === {} || !msg.text) {
    return;
  }
  if (msg.from.first_name != 'Артем') {
    if (msg.text.search(/(тема)|(артем)|(артемий)|(тёма)|(артём)|(тёмыч)|(темыч)|(бот)/i) >= 0) {
      if (msg.text.search(/(пидор)|(уебок)|(долбоеб)|(еб)|(чмо)|(мраз)|(тварь)|(сос)|(соси)|(шалава)|(пизд)|(член)|(клитор)|(хуй)|(хуя)|(пен)|(пис)|(пидар)/i) >= 0) {
        bot.sendMessage(msg.chat.id, `Пошел нахуй ${msg.from.first_name}`);
        return;
      }
    }
  }
  if (msg.text.search(/(как)/i) >= 0) {
    if (msg.text.search(/(яр)/i) >= 0) {
      if (msg.text.search(/(видит)/i) >= 0) {
        if (msg.text.search(/(член)|(хуй)|(хуя)|(пен)|(пис)/i) >= 0) {
          bot.sendDocument(msg.chat.id, `https://media.tenor.com/images/27c5f6ea44c97dc7957dfd4984a35f89/tenor.gif`);
          return;
        }
      }
    }
  }
  if (msg.text.search(/(размер)/i) >= 0) {
    if (msg.text.search(/(яр)/i) >= 0 && msg.text.search(/(яр)/i) === -1) {
      if (msg.text.search(/(член)|(хуй)|(хуя)|(пен)|(пис)/i) >= 0) {
        bot.sendMessage(msg.chat.id, `Посмотрите здесь https://ru.wikipedia.org/wiki/%D0%9D%D0%B0%D0%BD%D0%BE%D1%87%D0%B0%D1%81%D1%82%D0%B8%D1%86%D0%B0`);
        return;
      }
      bot.sendMessage(msg.chat.id, `Посмотрите здесь https://ru.wikipedia.org/wiki/%D0%9C%D0%B5%D1%82%D0%B0%D0%B3%D0%B0%D0%BB%D0%B0%D0%BA%D1%82%D0%B8%D0%BA%D0%B0`);
      return;
    }
  }
  if (msg.text.search(/(сколько)|(член)|(ярик)/i) >= 0) {
    if (counter.toString().length > 10) {
      bot.sendMessage(msg.chat.id, `Ярик отсосал ${1 / 0} членов`);
      return;
    }
    bot.sendMessage(msg.chat.id, `Ярик отсосал ${counter} членов`);
    counter += Math.floor(counter * Math.random() * 10);
    return;
  }
  if (msg.text.search(/(ренат)|(татарин)|(ренатик)/i) >= 0) {
    if (msg.text.search(/(выглядит)|(выглядет)/i) >= 0) {
      bot.sendDocument(msg.chat.id, `https://psv4.userapi.com/c848124/u24860541/docs/d3/3d7adf3a7ff0/MDK.gif?extra=ikCqLyYrRxZ6yaSiDyXhEqCwI1xEWiwM1hIY0CCUnY68pQnjoR44IzLvsuYlac7OIjKcoP-z7YzBt-A-nnIAVhBCqkwhdUwH7c-frl1zJZzaVe3gS6O-ZaqVs5OUsAX1-bY71lCdYGtS3QLRjYLV`);
      counter += 1;
      return;
    }
    bot.sendMessage(msg.chat.id, `Ренат пидор`);
    counter += 1;
    return;
  }
  if (msg.text.search(/(тема)|(артем)|(артемий)|(тёма)|(артём)|(тёмыч)|(темыч)/i) >= 0) {
    bot.sendMessage(msg.chat.id, `Темыч красава!`);
    counter += 1;
    return;
  }
  if (msg.text.search(/(миша)|(миха)|(михаил)|(михас)/i) >= 0) {
    bot.sendMessage(msg.chat.id, `Миха красава!`);
    counter += 1;
    return;
  }
  if (msg.text.search(/(влад)|(владислав)|(владик)|(владос)/i) >= 0) {
    bot.sendMessage(msg.chat.id, `Влад красава`);
    counter += 1;
    return;
  }
  if (msg.text.search(/(жека)|(женя)|(евгений)|(женек)|(женёк)/i) >= 0) {
    bot.sendMessage(msg.chat.id, `Жека пидор!`);
    counter += 1;
    return;
  }
  if (msg.text.search(/(оле)/i) >= 0) {
    bot.sendMessage(msg.chat.id, `Олег красава!`);
    counter += 1;
    return;
  }
  if (msg.text.search(/(сан)/i) >= 0) {
    bot.sendMessage(msg.chat.id, `Саня красава!`);
    counter += 1;
    return;
  }
  if (msg.text.search(/(макс)|(максим)/i) >= 0) {
    bot.sendMessage(msg.chat.id, `Макс красава!`);
    counter += 1;
    return;
  }
  if (msg.text.search(/(дима)|(дмитрий)|(димон)/i) >= 0) {
    bot.sendMessage(msg.chat.id, `Димон красава!`);
    counter += 1;
    return;
  }
  if (msg.text.search(/(бот)/i) >= 0) {
    if (msg.text.search(/(спокойной ночи)|(спокойной)/i) >= 0) {
      if (msg.from.first_name == 'Yaroslav') {
        bot.sendMessage(msg.chat.id, `Спокойной ночи Сосатор Членов`);
        return;
      }
      bot.sendMessage(msg.chat.id, `Спокойной ночи ${msg.from.first_name}!`);
      return;
    }
    if (msg.text.search(/(доброе утро)|(утро)/i) >= 0) {
      if (msg.from.first_name == 'Yaroslav' || msg.from.first_name == 'Evgeniy') {
        bot.sendMessage(msg.chat.id, `Доброе утро Сосатор Членов`);
        return;
      }
      bot.sendMessage(msg.chat.id, `Доброе утро ${msg.from.first_name}!`);
      return;
    }
    if (msg.text.search(/(скинь)|(отправь)|(какая)/i) >= 0) {
      if (msg.text.search(/(песн)/i) >= 0) {
        bot.sendAudio(msg.chat.id, `https://akkordam.ru/audio/vot-i-pomer-ded-maksim.MP3`);
        return;
      }
    }
  }
  if (msg.text.search(/(эд)/i) >= 0) {
    bot.sendMessage(msg.chat.id, `Эдик красава!`);
    counter += 1;
    return;
  }
  if (msg.from.first_name == 'Yaroslav' || msg.from.first_name == 'Evgeniy') {
    bot.sendMessage(msg.chat.id, `${msg.from.first_name} ты сосешь члены, не отвлекайся!`);
    return;
  }
  bot.sendMessage(msg.chat.id, `Ярик отсасывает члены, а ${msg.from.first_name} нет!`);
})
