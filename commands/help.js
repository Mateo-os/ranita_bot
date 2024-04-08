const { EmbedBuilder } = require('discord.js');
const config = require('../config/config');
const prefix = config.prefix;
async function help(message) {
    const infoE = new EmbedBuilder()
        .setColor(0x31593B)
        .setTitle(`Información sobre el bot`)
        .addFields(
            { name: `${prefix}album`, value: `Muestra todos los personajes que tienes, con sus imagenes.` },
            { name: `${prefix}award`, value: "Comando solo para el admin. Otorga rolls al jugador mencionado."}, 
            { name: `${prefix}checkcards`, value: "Comprobás si tenés el personaje que escribís." },
            { name: `${prefix}checkseries`, value: "Muestra todos las cartas de la serie que escribas." },
            { name: `${prefix}giftrolls`, value: "Ponés un número, mencionás a un usuario y le regalás las rolls indicadas." },
            { name: `${prefix}give`, value: "Comando solo para el admin. Permite entregar cualquier carta sabiendo su id.",inline:false},
            { name: `${prefix}info`, value: "Te da tu data." },
            { name: `${prefix}recycle`, value: "Permite reciclar la carta mencionada. Se puede dar una cantitidad especifica entre <brackets>, o reciclar todos los duplicados de la carta dejando una unica copia.\n [ALERTA] Especificando una cantidad puede dejarte sin copias de la carta."},
            { name: `${prefix}repeats`, value: "Muestra todas tus cartas con duplicados, o la del usuario que menciones." },
            { name: `${prefix}roll`, value: `Cada tirada son 3 personajes. Se consiguen mas tiradas diariamente (1 cada 24 horas) y según <@${config.owner}> vaya liberando.` },
            { name: `${prefix}scrap`, value: `Recicla todas las cartas repetidas de la rareza que menciones. Siempre te deja con una copia de cada carta.`},
            { name: `${prefix}take`, value:`Comando solo para el admin. Permite quitar cualquier carta de cualquier inventario sabiendo su id."`},
            { name: `${prefix}textalbum`, value:`Version de texto plano del comando de album. Para revisar rapido sin tener que ver las imágenes`},
            { name: `${prefix}trade`, value: `Inicia un intercambio con el jugador que menciones, tienes que ofrecer una carta.`},
            { name: 'Cuestiones tecnicas', value: "Contacte <@530487646766497792> o <@441325983363235841>."},
        ).setImage('https://www.manimalworld.net/medias/images/alytesmuletensis.jpg');
    message.channel.send({ embeds: [infoE] });
}


module.exports = {help};