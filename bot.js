require('dotenv').config()
var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');

var mistakes = 0;

logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
            case 'fout':
                mistakes++
                bot.sendMessage({
                    to: channelID,
                    message: 'Fout toegevoegd.'
                });
                break;

            case '-fout':
                if (mistakes > 0) {
                    mistakes--
                    bot.sendMessage({
                        to: channelID,
                        message: 'Fout verwijderd.'
                    });
                } else {
                    bot.sendMessage({
                        to: channelID,
                        message: 'Aantal fouten is 0.'
                    });
                }
                break;
    
            case 'aantal':
                bot.sendMessage({
                    to: channelID,
                    message: mistakes + ' fouten.'
                });
                break;
         }
     }
});