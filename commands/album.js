const parseCartas = require("./parse.js");
const findplayer = require("./findplayer.js");

async function album(player, message) {
    let usuario = (message.mentions.members.first()) ?
        await findplayer(message.mentions.members.first().user.id, message.guild.id) : player;
    if (!usuario.cartas) {
        return [`${usuario.nombre} no posee cartas`];
    }
    return [`Estas son las cartas totales de ${usuario.nombre}: \n`,
    parseCartas(usuario.cartas, showRepeats = true)];
}

module.exports = album;