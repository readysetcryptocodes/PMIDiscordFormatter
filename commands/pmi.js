const Discord = require('discord.js');
module.exports = {
	name: 'pmi',
    description: 'Display PMI. Example command call: !pmi 41.5 49.1 52.3 US',
    aliases: ['pmi'],
    args: true,
    usage: '<Latest Reading> <Last Month\'s Reading> <Last Year\'s Reading> <US or EU or CN or CON>',
	execute(message, args) {

        let latest = args[0];
        let lastMonth = args[1];
        let lastYear = args[2];
        let economy = args[3];
        let sentiment = '';
        let statOne = '';
        let statTwo = '';
        let statThree = '';
        let color = 0x77dd77;

        if ((economy === 'US' || economy === 'United')) 
            {
            sentiment = 'United States ISM Purchasing Managers Index (PMI)';
            statOne = 'Latest Reading: ';
            statTwo = 'Last Month\'s Reading: ';
            statThree = 'Last Year\'s Reading: ';
            color = 0xffffff;
            }
        else if ((economy === 'EU' || economy === 'Euro')) 
            {
            sentiment = 'Euro Area ESI (European Sentiment Indicator)';
            statOne = 'Latest Reading: ';
            statTwo = 'Last Month\'s Reading : ';
            statThree = 'Last Year\'s Reading: ';
            color = 0x0000ff;
            }
        else if ((economy === 'CN' || economy === 'China')) 
            {
            sentiment = 'Caixin Manufacturing PMI Purchasing Managers’ Index';
            statOne = 'Caixin Latest Reading: ';
            statTwo = 'Caixin Last Month\'s Reading: ';
            statThree = 'Caixin Last Year\'s Reading: ';
            color = 0xFF0000;
            }
        else if ((economy === 'CON' || economy === 'Consumer')) 
            {
            sentiment = 'University of Michigan US Consumer Survey Index';
            statOne = 'Latest Reading: ';
            statTwo = 'Last Month\'s Reading: ';
            statThree = 'Last Year\'s Reading: ';
            }
        else 
            {
            sentiment = 'Not Specified';
            statOne = 'Latest Reading: ';
            statTwo = 'Last Month\'s Reading: ';
            statThree = 'Last Year\'s Reading: ';
            }

        let yoy = (((latest-lastYear)/lastYear)*100).toFixed(2);
        let mom = (((latest-lastMonth)/lastMonth)*100).toFixed(2);

        const pmiEmbed = new Discord.MessageEmbed()
            .setColor(color)
            .setTitle('Sentiment Of: ' + sentiment)
            .addFields(
                { name: statOne, value: latest, inline: true},
                { name: statTwo, value: lastMonth, inline: true},
                { name: statThree, value: lastYear, inline: true},
                { name: 'Month Over Month Change', value: mom + '%', inline: true},
                { name: 'Year Over Year Change', value: yoy + '%', inline: true},
                )
            .setTimestamp()
            .setFooter('ReadySetCrypto', 'https://readyset.trade/wp-content/uploads/2020/05/BGAdd23.png');
        
        message.channel.send(pmiEmbed);
        message.react('✅');
	},
};