const {parseCartas} = require("../helpers");
const findplayer = require("./findplayer.js");

async function album(player, message) {
    let usuario = (message.mentions.members.first()) ?
        await findplayer(message.mentions.members.first().user.id, message.guild.id) : player;
    return [usuario, usuario.cartas]  
}

module.exports = {album};