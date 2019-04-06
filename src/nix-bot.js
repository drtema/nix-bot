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

const readRates = msg => {
  console.log(msg);
  const json = fs.createWriteStream("rates.json");
  const ratesXML = fs.readFileSync('rates.xml', 'utf8');
  const convertedBody = convert.xml2json(ratesXML, convertOptions);
  json.write(convertedBody, 'utf8');
  json.on('finish', () => json.close(() => { console.log('ratesJSON saved') }));
};

const ratesUpdate = () => setTimeout(() => {
  download(options.url, readRates);
  ratesUpdate();
}, 60000);

console.log('Bot has been started ....')

ratesUpdate();

const findRates = (msg, cur) => {
  const { id } = msg.chat;
  console.log(msg);
  const ratesJSON = JSON.parse(fs.readFileSync('./rates.json', 'utf8')).rates.item;
  const mes = ratesJSON.filter(rate => rate.from.value === cur).map(({ out, to, amount }) => `\n- ${out.value} ${curMap[to.value] || to.value}, Резерв: ${amount.value}`);
  bot.sendMessage(msg.chat.id, `Текущий курс за 1 ${curMap[cur]}: ${mes.toString()}`);
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

bot.onText(/\/start/, msg => {
  const { id } = msg.chat

  bot.sendMessage(msg.chat.id, `Привет, ${msg.from.first_name}!`);
  const mes = Object.entries(curMap).map(([k,v]) => {
    return `\nКурсы по ${v}: /rates_${k}`;
  });
  bot.sendMessage(msg.chat.id, `Доступные команды: ${mes.toString()}`);
  console.log(msg)
})

bot.on('message', msg => {
  // bot.sendMessage(msg.chat.id, `Привет, ${msg.from.first_name}!`);
})

bot.onText(/\/help/, msg => {
  const mes = Object.entries(curMap).map(([k,v]) => {
    return `\nКурсы по ${v}: /rates_${k}`;
  });
  bot.sendMessage(msg.chat.id, `Доступные команды: ${mes.toString()}`);
})

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