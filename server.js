var TelegramBot = require('node-telegram-bot-api');
var unirest = require('unirest');

var token = <BOT_TOLEN>;
var key = <API_KEY>;
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