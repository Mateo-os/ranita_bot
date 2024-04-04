const { findplayer } = require("../findplayer.js");
const helpers = require("../../helpers/index.js");

async function album(player, message) {
    const usuario = (message.mentions.members.first()) ?
        await findplayer(message.mentions.members.first().user.id, message.guild.id) : player;    
    if (!usuario) return [null,[]];
    const rare6 = {};
    const regularcards = {};
    usuario.cartas.forEach(c => {
        if (c.rareza == 6){
            if (!(c.serie in rare6))
                rare6[c.serie] = {};
            rare6[c.serie][c.numero] = c;
        } else {
            if (!(c.serie in regularcards))
                regularcards[c.serie] = {};
            regularcards[c.serie][c.numero] = c;
        }
    });
    const album = [];
    usuario.cartas.forEach(c => {
        if (c.rareza < 6){
            if((c.serie in rare6) && (c.numero in rare6[c.serie])){
                return;
            }
        }
        album.push(c);
    })
    album.sort((c1,c2) => { return helpers.orderCards(c1,c2)});   
    return [usuario,album]  
}

module.exports = {album};