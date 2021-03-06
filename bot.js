const Discord = require('discord.js');
const auth = require('./auth.json');

const fs = require('fs');

let mistakes = 0;
let whichOne = 0;

var dispatcher = null;

try {
    mistakes = JSON.parse(fs.readFileSync('./storage.json', "utf8")).mistakes;
    console.log('Al ' + mistakes + ' fouten gemaakt');

} catch (error) {
    console.log('mistakes.txt bestaat nog niet', error)
}

const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    setStatus();
});

client.on('message', async msg => {

    if (msg.content.substring(0, 1) === '!') {
        let args = msg.content.substring(1).split(' ');
        let cmd = args[0].toString();
        console.log(cmd);

        args = args.splice(1);
        switch (cmd.toLowerCase()) {
            case 'fout':
                try {
                    connection = await msg.member.voice.channel.join();
                    currentChannel = msg.member.voice.channel;
                    console.log('Now playing!');

                    if (whichOne === 0) {
                        dispatcher = connection.play('./sounds/heet.mp3');
                        whichOne = 1;
                    } else if (whichOne === 1) {
                        dispatcher = connection.play('./sounds/heet1.mp3');
                        whichOne = 0
                    }

                    dispatcher.setVolume(0.7);
                    dispatcher.on('finish', () => {
                        currentChannel.leave();
                        console.log('Finished playing!\nLeft channel.');
                    });
                } catch (error) {
                    console.log('error playing the sound');
                }
                mistakes++
                msg.channel.send('Fout toegevoegd. Aantal fouten: ' + mistakes)
                break;

            case 'andersfout':
                try {
                    connection = await msg.member.voice.channel.join();
                    currentChannel = msg.member.voice.channel;
                    console.log('Now playing!');

                    if (whichOne == 0) {
                        dispatcher = connection.play('./sounds/heet.mp3');
                        whichOne = 1;
                    } else if (whichOne == 1) {
                        dispatcher = connection.play('./sounds/heet1.mp3');
                        whichOne = 0
                    }

                    dispatcher.setVolume(0.7);
                    dispatcher.on('finish', () => {
                        currentChannel.leave();
                        console.log('Finished playing!\nLeft channel.');
                    });
                } catch (error) {
                    console.log('Error playing the sound');
                }
                break;

            case '-fout':
                if (mistakes > 0) {
                    mistakes--
                    msg.channel.send('Fout verwijderd. Aantal fouten: ' + mistakes)
                } else {
                    msg.channel.send('Huidig aantal fouten is 0.')
                }
                break;

            case 'resetcounter':
                if (msg.author.tag == 'Storm#1131') {
                    mistakes = 0
                    msg.channel.send('Counter reset. Huidig aantal fouten: ' + mistakes)
                }
                break;

            case 'aantal':
                msg.channel.send('Huidig aantal fouten: ' + mistakes)
                break;
        }
        fs.writeFileSync('storage.json', JSON.stringify({
            mistakes
        }))
        setStatus();
    }
});

client.login(auth.token);
function setStatus() {
    client.user.setActivity(', always. ' + mistakes.toString() + ' mistakes.', { type: 'WATCHING' });
}
