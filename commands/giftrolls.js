const {models} = require('../database');

async function giftrolls(player, message, args){
    const member = message.mentions.members.first().user.id;
    if (!member) return `No mencionaste jugador.`;
    let rolls=(args[0]==`<@${member}>`)?args[1]:args[0];
    if(rolls<0) return `No podés regalar rolls negativas`;
    if(rolls>player.rolls) return `No podés regalar mas rolls de las que tenés.`;
    const row = await models.Jugador.findOne({
        where:{id_discord:member}
    });
    row.increment('rolls',{'by':rolls});
    player.increment('rolls', {'by':-rolls});
    return `${message.author} le regalo ${rolls} roll/s a <@${member}>.`;
}

module.exports = giftrolls;