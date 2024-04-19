const { EmbedBuilder } = require('discord.js');
const { config } = require('../config/config');
const {sendPaginatedEmbed} = require('../helpers')
const prefix = config.prefix;
async function help(message) {
    const commands =  [
        { name: `${prefix}album`, value: `Muestra todos los personajes que tienes, con sus imagenes.` },
        { name: `${prefix}award`, value: "Comando solo para el admin. Otorga rolls al jugador mencionado."}, 
        { name: `${prefix}awardcoins`, value: "Comando solo para el admin. Permite otorgar dinero al jugador mencionado."},
        { name: `${prefix}buy`, value: "Permite comprar la carta nombrada al banco, si se tiene el dinero."},
        { name: `${prefix}buyrolls`, value: "Permite comprar los rolls especifcados a cambio de dinero. Se pueden comprar para uno o para el jugador mencionado.\n No especificar numero compra 1 Roll."},
        { name: `${prefix}checkcards`, value: "Muestra cartas cuyo nombre contenga al nombre dado." },
        { name: `${prefix}checkseries`, value: "Muestra todos las cartas de la serie que escribas." },
        { name: `${prefix}gift`, value: "Permite regalar una carta de tu inventario a un jugador mencionado."},
        { name: `${prefix}giftcoins`, value: "Permite transferir la cantidad de dinero especificada al jugador mencionado, siempre que tengas suficiente."},
        { name: `${prefix}giftrolls`, value: "Ponés un número, mencionás a un usuario y le regalás las rolls indicadas." },
        { name: `${prefix}give`, value: "Comando solo para el admin. Permite entregar cualquier carta sabiendo su id.",inline:false},
        { name: `${prefix}info`, value: "Te da tu data." },
        { name: `${prefix}recycle`, value: "Permite reciclar la carta mencionada. Se puede dar una cantitidad especifica entre <brackets>, o reciclar todos los duplicados de la carta dejando una unica copia.\n [ALERTA] Especificando una cantidad puede dejarte sin copias de la carta."},
        { name: `${prefix}repeats`, value: "Muestra todas tus cartas con duplicados, o la del usuario que menciones." },
        { name: `${prefix}roll`, value: `Cada tirada son 3 personajes. Se consiguen mas tiradas diariamente (1 cada 24 horas) y según <@${config.owner}> vaya liberando.` },
        { name: `${prefix}scrap`, value: `Recicla todas las cartas repetidas de la rareza que menciones. Siempre te deja con una copia de cada carta.`},
        { name: `${prefix}sell`, value:`Pemite vender la carta nombrada de tu inventario al banco a cambio de dinero.`},
        { name: `${prefix}shop`, value: `Permite ver el inventario de la tienda.`},
        { name: `${prefix}stock`, value: `Comando solo para el admin. Pemite agregar cualquier carta al inventario de la tienda sabiendo su id.`},
        { name: `${prefix}take`, value:`Comando solo para el admin. Permite quitar cualquier carta de cualquier inventario sabiendo su id.`},
        { name: `${prefix}textalbum`, value:`Version de texto plano del comando de album. Para revisar rapido sin tener que ver las imágenes`},
        { name: `${prefix}trade`, value: `Inicia un intercambio con el jugador que menciones, tienes que ofrecer una carta.`},
        { name: 'Cuestiones tecnicas', value: "Contacte <@530487646766497792> o <@441325983363235841>."}
    ]
    const pageSize = 5
    const totalPages = Math.ceil(commands.length / pageSize);
    const pages = [];
    for (let page = 0; page < totalPages; page++) {
        const start = page * pageSize;
        const end = start + pageSize;
        const embedPage = new EmbedBuilder()
        .setColor(0x31593B)
        .setTitle(`Información sobre el bot`)
        .addFields(commands.slice(start, end))
        .setImage('https://www.manimalworld.net/medias/images/alytesmuletensis.jpg');
        pages.push(embedPage);
    }
    await sendPaginatedEmbed(message,pages,5);
}


module.exports = {help};