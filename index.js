const { Client, Events } = require('discord.js');
const client = new Client({ intents: [37633]});
require('dotenv').config();
const { literal, where } = require('sequelize')
const {models} = require('./database');

const token = process.env.TOKEN;
const prefix = (process.env.PREFIX || '/');
async function incrementElement(amount=1) {
    try {
      const row = await models.Jugador.findAll();
      if (row) {
        row.forEach(element => {
            element.increment('rolls',{'by':amount});
            element.save();
        });
        console.log('Element incremented successfully.');
      }
    } catch (error) {
      console.error('Error incrementing element:', error);
    }
  }

function parseCartas(query,showRepeats=false){
    let response = "\`\`\`"
    query.forEach( elem => {
        const repeat = (elem.Cromo && elem.Cromo.cantidad > 1 && showRepeats) ? `[${elem.Cromo.cantidad}]` : '';
        const name = `Personaje: ${elem.nombre}`;
        const rarity = `Rareza: ${elem.rareza}`; 
        const series = `Serie: ${elem.serie}  (${elem.numero})`;
        response += `${repeat.padEnd(5)}${name.padEnd(35)}${rarity.padEnd(12)}${series}\n`;
    });
    response += "\`\`\`"
    return response;
}

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    setInterval(incrementElement, 24 * 60 * 60 * 1000);
});
client.on('messageCreate', async message => {
    
    if (!message.content.startsWith(prefix) || message.author.bot){
        return;
    }

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
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
            id_servidor: server.id,
        });
        new_player.cartas = []
        message.channel.send('Bienvenido al juego ' + new_player.nombre.toUpperCase());
        player = new_player;
    }
    const command = args.shift().toLowerCase();
    let responses = [];
    switch(command){
        case 'test':
            incrementElement(100);
            if(args.length){
                responses.push('Estos son los argumentos que diste');
                args.forEach(a => responses.push(a));
            }else{
                responses.push('No diste mas argumentos');
            }
            break;
        case 'roll':
            if(player.rolls <= 0){
                responses.push('No tenés rolls');
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
                    message.channel.send('DUPLICADA');
                    c.Cromo.increment('cantidad');
                    c.save();
                }
            })
            player.addCartas(new_cards.filter(elem => !(elem.id in card_ids)));
            player.decrement('rolls');
            responses.push(parseCartas(new_cards));
            break;
        case 'album':
            responses.push('Estas son tus cartas totales: \n');
            responses.push(parseCartas(player.cartas,showRepeats=true));
            break;
        case 'info':
            responses.push(`Hola ${player.nombre} estos son tus datos:\n`)
            const repetidas = player.cartas.filter(c => c.Cromo.cantidad > 1);
            const amount = repetidas.reduce((acc,carta) => acc + (carta.Cromo.cantidad - 1), 0);
            let info = `\`\`\`Rolls: ${player.rolls}\nCartas repetidas: ${amount}\`\`\``;
            responses.push(info);

        
    }
    if(!responses){
        return;
    }
    for(let i in responses){
        r = responses[i]
        if(r.length < 2000){
            message.channel.send(r);
            continue;
        }
        const wrap = (s) => {return '\`\`\`' + s + '\`\`\`'};
        const mono = r.startsWith('\`');
        let temp = r.replace(/\`\`\`/g, "");
        let index = 0;
        
        while(index < temp.length){
            const end = index + 1001;
            const tail = temp.slice(end);
            let buffer = temp.slice(index,end);
            buffer += tail.slice(0,tail.indexOf('\n'));
            index += buffer.length;
            if(mono){
                buffer = wrap(buffer);
            }
            message.channel.send(buffer)
        }
    }
}); 

client.login(token);