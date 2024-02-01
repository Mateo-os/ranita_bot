const { Client, Events } = require('discord.js');
const client = new Client({ intents: [37633]});
require('dotenv').config();
const { literal, where } = require('sequelize')
const {models} = require('./database');

const token = process.env.TOKEN;
const user = process.env.DBUSER;
async function incrementElement() {
    try {
      const row = await models.Jugador.findAll();
      if (row) {
        row.forEach(element => {
            element.increment('rolls');
            element.save();
        });
        console.log('Element incremented successfully.');
      }
    } catch (error) {
      console.error('Error incrementing element:', error);
    }
  }

function parseCartas(query){
    let response = "\`\`\`"
    query.forEach( elem => {
        const repeat = (elem.Cromo && elem.Cromo.cantidad > 1) ? "[" + elem.Cromo.cantidad + "]" : ''
        const name = "Personaje: " + elem.nombre;
        const rarity = " Rareza: " + elem.rareza; 
        const series = " Serie: " + elem.serie + " (" + elem.numero + ")" + "\n";
        response += repeat.padEnd(5) + name.padEnd(35) + rarity.padEnd(15) + series;
    });
    response += "\`\`\`"
    return response;
}

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    setInterval(incrementElement, 24 * 60 * 60 * 1000);
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
            console.log(player.toJSON());
            console.log(player.cartas);
            incrementElement();
            break;
        case 'roll':
            if(player.rolls <= 0){
                response += 'No tenés rolls';
                break
            }
            let new_cards = [];
            let card_ids = []; 
            for (i=0;i<5;i++){
                let random = Math.floor(Math.random()*1000);
                if (random <=4) rare = 5;
                else if (random <= 30) rare = 4;
                else if (random <= 100) rare = 3;
                else if (random <= 300) rare = 2;
                else rare = 1;
                card = await models.Carta.findOne({
                    where:{rareza:rare},
                    order:literal("RAND()"),
                },)
                new_cards.push(card);
                card_ids.push(card.id);              
            }
            player.cartas.forEach(c =>{
                if(card_ids.includes(c.id)){
                    c.Cromo.increment('cantidad');
                    c.save();
                }
            })
            player.addCartas(new_cards.filter(elem => !(elem.id in card_ids)));
            player.decrement('rolls');
            response = parseCartas(new_cards);
            break;
        case 'chapas':
            response = 'Estas son tus cartas totales: \n';
            response += parseCartas(player.cartas);
            break;
    }
    if(response)
        message.channel.send(response);
}); 

client.login(token);