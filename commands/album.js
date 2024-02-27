const {parseCartas} = require("../helpers");
const findplayer = require("./findplayer.js");

async function album(player, message) {
    const usuario = (message.mentions.members.first()) ?
        await findplayer(message.mentions.members.first().user.id, message.guild.id) : player;
    const album =  usuario.cartas.sort((c1,c2) => {
        const comp = c1.serie.localeCompare(c2.serie);
        if(comp) return comp;
        else return c1.numero - c2.numero;
    });
    
    return [usuario,album]  
}

module.exports = {album};