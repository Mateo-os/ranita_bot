const { Client, Events } = require('discord.js');
const client = new Client({ intents: [37633]});
require('dotenv').config();
const { literal } = require('sequelize')
const {models} = require('./database');

const token = process.env.TOKEN;

function parseCartas(query){
    let response = "\`\`\`"
    query.forEach( elem => {
        const name = "Personaje: " + elem.nombre;
        const rarity = " Rareza: " + elem.rareza; 
        const series = " Serie: " + elem.serie + " (" + elem.numero + ")" + "\n";
        response += name.padEnd(30) + rarity.padEnd(15) + series;
    });
    response += "\`\`\`"
    return response;
}



client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});
client.on('messageCreate', async message => {
    if (message.content.charAt(0) != '/' || message.author.bot){
        return;
    }
    const author = message.author;
    const server = message.guild;
    let player = await models.Jugador.findOne({
        where: {
            id_discord : author.id,
            id_servidor: server.id,
        },
        include : 'cartas',
    });

    if(!player) {
        message.channel.send("Hola noob ahi te creo un perfil");
        const new_player = await models.Jugador.create({
            nombre:author.username,
            id_discord: author.id,
            id_servidor: server.id
        });
        message.channel.send('Bienvenido al juego ' + new_player.nombre.toUpperCase());
        player = new_player;
    }

    const msg = message.content.replace('/','');
    let response = '';
    switch(msg){
        case 'test':
            console.log(player.cartas);
            break;
        case 'roll':
            const query = await models.Carta.findAll({
                order: literal('RAND() * (1 / rareza)'),
                limit: 5,
            });
            player.addCartas(query);
            response = parseCartas(query);
            player.save();
            break;
        case 'chapas':
            response = 'Estas son tus cartas totales: \n';
            response += parseCartas(player.cartas);
            break;
    }
    if (response){ 
        message.channel.send(response)
    }
}); 

client.login(token);