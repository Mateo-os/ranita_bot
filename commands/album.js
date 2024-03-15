const {parseCartas} = require("../helpers");
const { findplayer } = require("./findplayer.js");

function orderCards(c1, c2){
    //ORDER CRITERIA: 
    // 1. DESCENDING BY RARITY
    // 2. ALPHABETICAL BY SERIES
    // 3. ASCENDING BY NUMBER 
    if(c1.rareza != c2.rareza)
        return c2.rareza - c1.rareza;
    const strcomp = c1.serie.localeCompare(c2.serie);
    if (strcomp != 0)
        return strcomp;
    return c1.numero - c2.numero;
}



async function album(player, message) {
    const usuario = (message.mentions.members.first()) ?
        await findplayer(message.mentions.members.first().user.id, message.guild.id) : player;    
    if (!usuario) return [null,[]];
    const rare6 = {};
    const regularcards = {};
    usuario.cartas.forEach(c => {
        if (c.rareza == 6){
            rare6[c.serie] = {};
            rare6[c.serie][c.numero] = c;
        } else {
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
    album.sort((c1,c2) => { return orderCards(c1,c2)});   
    return [usuario,album]  
}

module.exports = {album};