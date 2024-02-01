const { Client, Events } = require('discord.js');
const client = new Client({ intents: [37633]});
require('dotenv').config();
const {models} = require('./database');
const incrementElement = require("./commands/increment.js");
const roll = require("./commands/roll.js");
const show = require("./commands/show.js");
const album = require("./commands/album.js");
const info = require("./commands/info.js");

const token = process.env.TOKEN;
const prefix = (process.env.PREFIX || '/');

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    setInterval(incrementElement, 24 * 60 * 60 * 1000);
});

client.on('messageCreate', async message => {
    
    if (!message.content.startsWith(prefix) || message.author.bot)
        return;

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
            }else
                responses.push('No diste mas argumentos');
            break;
        case 'roll':
            roll(player, responses, message);
            break;
        case 'album':
            album(player, responses);
            break;
        case 'info':
            info(responses, player);
            break;
    }
    show(responses,message);
}); 

client.login(token);