const { Client, Events, EmbedBuilder  } = require('discord.js');
const client = new Client({ intents: [37633]});
require('dotenv').config();
const {models} = require('./database');
const {
    incrementElement,
    roll,
    show,
    album,
    info,
    ownerrolls,
    giftrolls,
    newplayer
} = require("./commands/commands.js");

const token = process.env.TOKEN;
const prefix = (process.env.PREFIX || '/');
const owner = process.env.IDOWNER;

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    setInterval(incrementElement, 86400000); // 86400000 ms in day
});

client.on('messageCreate', async message => {
    
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    let responses = [];
    
    let player = await models.Jugador.findOne({
        where: {
            id_discord : message.author.id,
            id_servidor: message.guild.id,
        }, include : 'cartas',
    });

    if(!player) player = await newplayer(message);

    switch(command){
        case 'test':
            incrementElement(100);
            const infoE = new EmbedBuilder()
            .setColor(0x31593B)
            .setTitle(`Información sobre ${message.author.username.toUpperCase()}`)
            .addFields(
                { name: 'Rolls: ', value: `${player.rolls}`, inline: true},
                { name: 'Cromos en el album:', value: `${player.cartas.length}`, inline: true },
                { name: 'Owner?', value: (message.author.id === owner)?"Sí":"No", inline: true },
            ).setImage('https://www.manimalworld.net/medias/images/alytesmuletensis.jpg');
            message.channel.send({ embeds: [infoE] });
            //responses = responses.push({ embeds: [infoE] }); //No funciona al no ser un string
            break;
        case 'roll':
            responses = responses.concat(await roll(player));
            break;
        case 'album':
            responses = responses.concat(album(player));
            break;
        case 'info':
            responses = responses.concat(await info(player));
            break;
        case 'ownerrolls':
            responses = responses.concat(await ownerrolls(message, args));
            break;
        case 'giftrolls':
            responses = responses.concat(await giftrolls(player,message,args));
            break;
    }
    show(responses,message);
}); 

client.login(token);