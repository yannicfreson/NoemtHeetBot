const Discord = require('discord.js');
const auth = require('./auth.json');

const fs = require('fs');

let mistakes = 0;

try {
    mistakes = JSON.parse(fs.readFileSync('./storage.json',"utf8")).mistakes;
    console.log('Reeds ' + mistakes + ' fouten gemaakt');
        
} catch (error) {
    console.log("mistakes.txt bestaat nog niet",error)
}


function setStatus () {
    client.user.setActivity(mistakes.toString(), { type: 'LISTENING' });
}

const client = new Discord.Client();
 
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    setStatus();
});

client.on('message', msg => {
  if (msg.content === '!ping') {
    msg.channel.send('!pong');
  }

  if (msg.content.substring(0, 1) === '!') {
    let args = msg.content.substring(1).split(' ');
    const cmd = args[0];
   
    args = args.splice(1);
    switch(cmd) {
        case 'fout':
            mistakes++
            msg.channel.send('Fout toegevoegd, huidig aantal fouten: ' + mistakes)
            break;

        case '-fout':
            if (mistakes > 0) {
                mistakes--
                msg.channel.send('Fout verwijderd, huidig aantal fouten: ' + mistakes)
            } else {
                msg.channel.send('Huidig aantal fouten is 0.')
            }
            break;

        case 'resetCounter':
            
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

