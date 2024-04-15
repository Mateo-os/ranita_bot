const { findplayer } = require("../findplayer.js");

async function giftcoins(player, message, args){
    if (!message.mentions.members.first()) return `No mencionaste jugador.`;
    const member = message.mentions.members.first().user.id;
    let coins=((args[0]==`<@${member}>`)?args[1]:args[0]) || 1;
    if(coins<0) return `No podés regalar una cantidad negativa de dinero.`;
    if(coins>player.coins) return `No podés regalar mas dinero del que tenés.`;
    const row = await findplayer(member, message.guild.id);
    if (!row) return `Ese usuario no esta registrado`
    row.increment('coins',{'by':coins});
    player.decrement('coins',{'by':coins});
    return `${message.author} le regaló ${coins} Ranita${coins > 1 ? 's':''} a <@${member}>.`;
}

module.exports = {giftcoins};