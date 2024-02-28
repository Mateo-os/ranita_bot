const {parseCartas} = require("../helpers");
const findplayer = require("./findplayer.js");

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
    const album =  usuario.cartas.slice();
    album.sort((c1,c2) => { return orderCards(c1,c2)});   
    return [usuario,album]  
}

module.exports = {album};