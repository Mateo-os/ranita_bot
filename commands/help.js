const { EmbedBuilder } = require('discord.js');
const config = require('../config/config');
const prefix = config.prefix;
async function help(message) {
    const infoE = new EmbedBuilder()
        .setColor(0x31593B)
        .setTitle(`Información sobre el bot`)
        .addFields(
            { name: `${prefix}album`, value: `Muestra todos los personajes que tienes.` },
            { name: `${prefix}checkcards`, value: "Comprobás si tenés el personaje que escribís." },
            { name: `${prefix}checkseries`, value: "Muestra todos las cartas de la serie que escribas." },
            { name: `${prefix}giftrolls`, value: "Ponés un número, mencionás a un usuario y le regalás las rolls indicadas." },
            { name: `${prefix}give`, value: "Comando solo para el admin. Permite entregar cualquier carta sabiendo su id.",inline:false},
            { name: `${prefix}info`, value: "Te da tu data." },
            { name: `${prefix}repeats`, value: "Muestra todas tus cartas con duplicados, o la del usuario que menciones." },
            { name: `${prefix}roll`, value: `Cada tirada son 3 personajes. Se consiguen mas tiradas diariamente (1 cada 24 horas) y según <@273266775481778177> vaya liberando.` },
            { name: 'Cuestiones tecnicas', value: "Contacte <@530487646766497792> o <@441325983363235841>."},
        ).setImage('https://www.manimalworld.net/medias/images/alytesmuletensis.jpg');
    message.channel.send({ embeds: [infoE] });
}


module.exports = {help};