const {models} = require('../../database');
const { findplayer } = require("../findplayer.js");

async function giftrolls(player, message, args){
    if (!message.mentions.members.first()) return `No mencionaste jugador.`;
    const member = message.mentions.members.first().user.id;
    let rolls=((args[0]==`<@${member}>`)?args[1]:args[0]) || 1;
    if(rolls<0) return `No podés regalar rolls negativas`;
    if(rolls>player.rolls) return `No podés regalar mas rolls de las que tenés.`;
    const row = await findplayer(member, message.guild.id);
    if (!row) return `Ese usuario no esta registrado`
    row.increment('rolls',{'by':rolls});
    player.decrement('rolls',{'by':rolls});
    return `${message.author} le regalo ${rolls} roll/s a <@${member}>.`;
}

module.exports = {giftrolls};