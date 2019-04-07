import TelegramBot from 'node-telegram-bot-api';
import request from "request";
import convert from "xml-js";
import fs from 'fs';
import { isObject } from 'util';

const TOKEN = '670943276:AAG79PnY2E5fDgDbxCi46pZlhgktkv7rTok';
const convertOptions = { compact: true, spaces: 4, ignoreComment: true, alwaysChildren: true, textKey: 'value' };
const options = {
  url: 'https://nixexchange.com/best.xml',
};

const curMap = {
  ['NIXUSD']: 'Nixmoney USD',
  ['NIXBTC']: 'Nixmoney BTC',
  ['NIXEUR']: 'Nixmoney EUR',
  ['YAMRUB']: 'Yandex RUB',
  ['QWRUB']: 'Qiwi RUB',
  ['PMUSD']: 'Perfect Money USD',
  ['P24UAH']: 'Приват24 UAH',
  ['PSBRUB']: 'ПромСвязьБанк RUB',
  ['TBRUB']: 'ВТБ24 RUB',
  ['RNKBRUB']: 'РНКБ RUB',
  ['CARDRUB']: 'MSC/Visa/Maestro RUB',
  ['CARDUAH']: 'MSC/Visa/Maestro UAH',
  ['RFBUAH']: 'РайффайзенБанк UAH',
  ['PRUSD']: 'PAYEER USD',
  ['PRRUB']: 'PAYEER RUB',
  ['POSTBRUB']: 'ПочтаБанк RUB',
  ['PMBBUAH']: 'Пумб UAH',
  ['ADVCUSD']: 'Advcash USD',
  ['USBUAH']: 'УкрсибБанк UAH',
  ['EXMUSD']: 'Exmo-Code USD',
};

const helpOptions = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{ text: 'Помощь', callback_data: '_help' }],
      [{ text: 'Курсы', callback_data: '_rates' }],
      // [{ text: 'Просчитать обмен', callback_data: '_calc' }],
      [{ text: 'Заказать резерв', callback_data: '_amount' }],
    ]
  })
};
const initRatesButtons = (command) => {
  const btns = Object.entries(curMap).map(([k, v]) => [{
    ['text']: v,
    ['callback_data']: `${command}_${k}`
  }]);
  return {
    reply_markup: JSON.stringify({
      inline_keyboard: btns
    })
  }
};
const ratesButtons = initRatesButtons('rates');
const amountButtons = initRatesButtons('amount');
const download = (url, cb) => {
  const file = fs.createWriteStream("rates.xml");
  const sendReq = request.get(url);

  sendReq.on('response', (response) => {
    if (response.statusCode !== 200) {
      return cb('Response status was ' + response.statusCode);
    }
    sendReq.pipe(file);
  });

  file.on('finish', () => file.close(() => cb('Rates parsed')));

  sendReq.on('error', (err) => {
    fs.unlink("rates.xml");
    return cb(err.message);
  });

  file.on('error', (err) => {
    fs.unlink("rates.xml");
    return cb(err.message);
  });
};

const getCurrentTime = () => {
  const date = new Date();
  return `${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}:${date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()}`;
};

const readRates = msg => {
  const time = getCurrentTime();
  console.log(`[${time}]:${msg}`);
  const json = fs.createWriteStream("rates.json");
  const ratesXML = fs.readFileSync('rates.xml', 'utf8');
  const convertedBody = convert.xml2json(ratesXML, convertOptions);
  json.write(convertedBody, 'utf8');
  json.on('finish', () => json.close(() => { console.log('ratesJSON saved') }));
};

const amountOrdersUpdate = (orders, cb = () => { }) => {
  const json = fs.createWriteStream("amountOrders.json");
  json.write(JSON.stringify({ "amountNotes": orders }), 'utf8');
  json.on('finish', () => json.close());
  cb();
}

const amountNotes = JSON.parse(fs.readFileSync('amountOrders.json', 'utf8')).amountNotes;;

const ratesUpdate = () => setTimeout(() => {
  download(options.url, readRates);
  amountNotes.forEach((order, index) => {
    if (findAmount(order.currency, order.amount)) {
      bot.sendMessage(order.user, `Запрашиваемая вами сумма ${order.amount} ${curMap[order.currency]} уже доступна для обмена.`);
      amountNotes.splice(index, 1);
      amountOrdersUpdate(amountNotes);
    }
  });
  ratesUpdate();
}, 60000);

console.log('Bot has been started ....')

ratesUpdate();

const findRates = (msg, cur) => {
  const { id } = msg.chat || msg.from;
  const ratesJSON = JSON.parse(fs.readFileSync('./rates.json', 'utf8')).rates.item;
  const mes = ratesJSON.filter(rate => rate.from.value === cur).map(({ out, to, amount }) => `\n- ${out.value} ${curMap[to.value] || to.value}, Резерв: ${amount.value}`);
  bot.sendMessage(id, `Текущий курс за 1 ${curMap[cur]}: ${mes.toString()}`);
};

const findAmount = (cur, ordAmount) => {
  const ratesJSON = JSON.parse(fs.readFileSync('./rates.json', 'utf8')).rates.item;
  return ratesJSON.find(rate => rate.to.value === cur).amount.value >= ordAmount;
};

const restartMessageHandler = () => {
  bot.off('message');
  bot.on('message', msg => {
    console.log(msg);
  })
};

const orderAmount = (msg, cur) => {
  bot.sendMessage(msg.from.id, `Введите нужную сумму`).then(() => {
    const timer = setTimeout(() => {
      bot.sendMessage(msg.from.id, `Ваш запрос отменен.`);
      restartMessageHandler();
    }, 60000);
    bot.on('message', msg => {
      timer && clearTimeout(timer);
      const ordAmount = Number(msg.text);
      if (isNaN(ordAmount)) {
        bot.sendMessage(msg.from.id, `Введенное число неверно. Повторите ввод.`);
        restartMessageHandler();
        orderAmount(msg, cur);
        return;
      }
      if (findAmount(cur, ordAmount)) {
        bot.sendMessage(msg.from.id, `Запрашиваемая вами сумма ${curMap[cur]} уже доступна для обмена.`);
      } else {
        const isOrderExist = amountNotes.some(order => order.user === msg.from.id && order.currency === cur && order.amount == ordAmount);
        if (isOrderExist) {
          bot.sendMessage(msg.from.id, `Ваш запрос на ${ordAmount} ${curMap[cur]} уже существует.\nКак только необходимая сумма появится у нас в резервах, мы Вам сообщим.`);
          restartMessageHandler();
          return;
        }
        amountNotes.push({ user: msg.from.id, currency: cur, amount: ordAmount });
        amountOrdersUpdate(amountNotes, () => {
          bot.sendMessage(msg.from.id, `Ваш запрос на ${ordAmount} ${curMap[cur]} успешно создан.\nКак только необходимая сумма появится у нас в резервах, мы Вам сообщим.`);
        });
      }
      console.log(amountNotes);
      restartMessageHandler();
    })
  });
};

const bot = new TelegramBot(TOKEN, {
  polling: {
    interval: 300,
    autoStart: true,
    params: {
      timeout: 10
    }
  }
})
// bot.sendMessage(-1001179107043, `Доступные команды:`, helpOptions).then(res => {
//   bot.pinChatMessage(res.chat.id, res.message_id);
// });
bot.onText(/\/start/, msg => {
  const { id } = msg.chat

  bot.sendMessage(msg.chat.id, `Привет, ${msg.from.first_name}!`).then(() => {
    bot.sendMessage(msg.chat.id, `Доступные команды:`, helpOptions).then(res => {
      bot.pinChatMessage(res.chat.id, res.message_id);
    });
  });
  console.log(msg)
})

bot.on('message', msg => {
  console.log(msg);
})

bot.onText(/\/help/, msg => {
  bot.sendMessage(msg.chat.id, `Доступные команды:`, helpOptions);
})

bot.on('callback_query', msg => {
  const answer = msg.data.split('_');
  if (answer[0] === 'rates') {
    findRates(msg, answer[1]);
    return;
  }
  if (answer[0] === 'amount') {
    orderAmount(msg, answer[1]);
    return;
  }
  switch (answer[1]) {
    case 'help':
      bot.sendMessage(msg.from.id, `Доступные команды:`, helpOptions);
      break;
    case 'rates':
      bot.sendMessage(msg.from.id, `Доступные валюты:`, ratesButtons);
      break;
    case 'amount':
      bot.sendMessage(msg.from.id, `Доступные валюты:`, amountButtons);
      break;
      // case 'calc':
      //   bot.sendMessage(msg.from.id, `Доступные валюты:`, ratesButtons);
      break;
    default:
      break;
  }
});

bot.onText(/\/rates_ALL/, msg => {
  const { id } = msg.chat;
  console.log(msg);
  const ratesJSON = JSON.parse(fs.readFileSync('./rates.json', 'utf8')).rates.item;
  const mes = ratesJSON.map(rate => `\nТекущий курс за 1 ${rate.from.value} - ${rate.out.value} ${rate.to.value}`);
  bot.sendMessage(msg.chat.id, mes.slice(0, 90).toString());
  bot.sendMessage(msg.chat.id, mes.slice(90, 180).toString());
  bot.sendMessage(msg.chat.id, mes.slice(180, mes.length - 1).toString());
})

bot.onText(/\/rates_NIXUSD/, msg => {
  findRates(msg, 'NIXUSD');
})

bot.onText(/\/rates_NIXBTC/, msg => {
  findRates(msg, 'NIXBTC');
})

bot.onText(/\/rates_NIXEUR/, msg => {
  findRates(msg, 'NIXEUR');
})

bot.onText(/\/rates_YAMRUB/, msg => {
  findRates(msg, 'YAMRUB');
})

bot.onText(/\/rates_QWRUB/, msg => {
  findRates(msg, 'QWRUB');
})

bot.onText(/\/rates_PMUSD/, msg => {
  findRates(msg, 'PMUSD');
})

bot.onText(/\/rates_P24UAH/, msg => {
  findRates(msg, 'P24UAH');
})

bot.onText(/\/rates_PSBRUB/, msg => {
  findRates(msg, 'PSBRUB');
})

bot.onText(/\/rates_TBRUB/, msg => {
  findRates(msg, 'TBRUB');
})

bot.onText(/\/rates_RNKBRUB/, msg => {
  findRates(msg, 'RNKBRUB');
})

bot.onText(/\/rates_CARDRUB/, msg => {
  findRates(msg, 'CARDRUB');
})

bot.onText(/\/rates_CARDUAH/, msg => {
  findRates(msg, 'CARDUAH');
})

bot.onText(/\/rates_RFBUAH/, msg => {
  findRates(msg, 'RFBUAH');
})

bot.onText(/\/rates_PRUSD/, msg => {
  findRates(msg, 'PRUSD');
})

bot.onText(/\/rates_PRRUB/, msg => {
  findRates(msg, 'PRRUB');
})

bot.onText(/\/rates_POSTBRUB/, msg => {
  findRates(msg, 'POSTBRUB');
})

bot.onText(/\/rates_PMBBUAH/, msg => {
  findRates(msg, 'PMBBUAH');
})

bot.onText(/\/rates_ADVCUSD/, msg => {
  findRates(msg, 'ADVCUSD');
})

bot.onText(/\/rates_USBUAH/, msg => {
  findRates(msg, 'USBUAH');
})

bot.onText(/\/rates_EXMUSD/, msg => {
  findRates(msg, 'EXMUSD');
})