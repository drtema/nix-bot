import TelegramBot from 'node-telegram-bot-api';
import request from "request";
import convert from "xml-js";

const TOKEN = '670943276:AAG79PnY2E5fDgDbxCi46pZlhgktkv7rTok';

var options = {
  method: 'GET',
  url: 'https://nixexchange.com/best.xml',
  headers:
    {
      'upgrade-insecure-requests': '1',
      cookie: '__cfduid=dd77c6dbfa3531a605505a8293a5ffc781545759397; _ga=GA1.2.1236898171.1547242107; _fbp=fb.1.1549797461221.870227624; _gcl_aw=GCL.1550054941.Cj0KCQiAnY_jBRDdARIsAIEqpJ0f8RhLWbWwymx8RuY3TQ1Kj-BsWpYEJdckXEbTy8zsveIL08WJwnsaApDBEALw_wcB; _gac_UA-129808825-1=1.1550054941.Cj0KCQiAnY_jBRDdARIsAIEqpJ0f8RhLWbWwymx8RuY3TQ1Kj-BsWpYEJdckXEbTy8zsveIL08WJwnsaApDBEALw_wcB; jv_visits_count_cncMTDttxw=5; cf_clearance=d4d99e775ef209f1df2a4334a480594c9e0db5a8-1552825600-1800-150',
      'cache-control': 'max-age=0,no-cache',
      'accept-language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
      'accept-encoding': 'gzip, deflate, br',
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3'
    }
};

var xml =
  '<?xml version="1.0" encoding="utf-8"?>' +
  '<note importance="high" logged="true">' +
  '    <title>Happy</title>' +
  '    <todo>Work</todo>' +
  '    <todo>Play</todo>' +
  '</note>';

const ratesRequest = () => request(options, (error, response, body) => {
  if (error) console.log(error);
  // console.log(response.toJSON());

  const convertedBody = convert.xml2json(response.toJSON().body, { compact: true, spaces: 4 });

  console.log(convertedBody);
});


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
  bot.sendMessage(msg.chat.id, `Привет Жека!`);
})

bot.onText(/\/rates/, msg => {
  const { id } = msg.chat

  bot.sendMessage(msg.chat.id, `${ratesRequest()}!`);
  console.log(msg)
})
