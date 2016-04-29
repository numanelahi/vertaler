var TelegramBot = require('node-telegram-bot-api');
var unirest = require('unirest');

var token = '186253056:AAH_1mmK5DFdSe-4JwsvM2w8ydtHoD-1dro';
var key = 'trnsl.1.1.20160429T055226Z.ad9ff8a646a39d38.2791ff1f75fc277eafc53bd34e7205c35d4c7cf4';
// See https://developers.openshift.com/en/node-js-environment-variables.html
var port = process.env.OPENSHIFT_NODEJS_PORT;
var host = process.env.OPENSHIFT_NODEJS_IP;
var domain = process.env.OPENSHIFT_APP_DNS;

var bot = new TelegramBot(token, {webHook: {port: port, host: host}});
// OpenShift enroutes :443 request to OPENSHIFT_NODEJS_PORT
bot.setWebHook(domain+':443/bot'+token);
bot.on('message', function (msg) {
  var chatId = msg.chat.id;
  var user = msg.from.username;
  if(msg.text)
  {
	  unirest.post('https://translate.yandex.net/api/v1.5/tr.json/translate')
        .send({ "key": key, "text": msg.text, "lang":"en", "options":1 })
        .end(function (response) {
            var resp = JSON.parse(response.raw_body);
			if(resp.detected.lang !== "en"){
				bot.sendMessage(chatId, user + " says : "+resp.text[0]);
			}			
        });	  
  }
});