const { Client, Events } = require('discord.js');
const client = new Client({ intents: [37633]});
require('dotenv').config();
const { literal } = require('sequelize')
const {models} = require('./database');

const token = process.env.TOKEN;

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});
client.on('messageCreate', async message => {
    if (message.content.charAt(0) != '/'){
        return;
    }  
    const msg = message.content.replace('/','');
    let response = '';
    switch(msg){
        case 'roll':
            const query = await models.Carta.findAll({
                order: literal('RAND() * (1 / rareza)'),
                limit: 5,
            });
            response += "\`\`\`"
            query.forEach( elem => {
                const name = "Personaje: " + elem.nombre;
                const rarity = " Rareza: " + elem.rareza; 
                const series = " Serie: " + elem.serie + " (" + elem.numero + ")" + "\n";
                response += name.padEnd(30) + rarity.padEnd(15) + series;
            })
            response += "\`\`\`"
            break;
        case 'chapas':
            response = 'No me presten atencion, probando cosas 2';
            break;
    }
    if (response){ 
        message.channel.send(response)
    }
}); 

client.login(token);