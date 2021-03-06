const fs = require('fs');
const Discord = require('discord.js');
require('dotenv').config(); 
const { prefix, token } = require('./config.json');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}
client.once('ready', () => {
	//CURRENTLY RUNNING: 
	//PREFIX: !

    console.log('The computer can be used as a tool to liberate and protect people, rather than to control them.')
    client.user.setActivity('Money Printers', {type: 'LISTENING'})
});

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command) return;
    if (command.guildOnly && message.channel.type !== 'text') 
        {
        message.react('❌');
		return message.reply('I can\'t execute that command inside DMs!');
	    }
    if (command.args && !args.length) 
        {
		let reply = `You didn't provide any arguments, ${message.author}!`;
        if (command.usage) 
            {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
            message.react('❌');
		    }
        return message.channel.send(reply);
	    }
    if (!cooldowns.has(command.name)) 
        {
		cooldowns.set(command.name, new Discord.Collection());
	    }
	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;
	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
		if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            message.react('❌');
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
    }
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	try {
        command.execute(message, args);
        }
	catch (error) {
        message.react('❌');
		console.error(error);
		message.reply('there was an error trying to execute that command!');
    }
});
client.login(token);

