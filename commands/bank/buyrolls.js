const { findplayer } = require('../findplayer.js');
const helpers = require('../../helpers');
async function buyrolls(player,message, args) {
    const mentionedMember =  message.mentions.members.first();
    const member_id = mentionedMember ? mentionedMember.user.id : player.id_discord;
    const server_id = message.guild.id;
    const member = await findplayer(member_id, server_id);
    let amount = ((args[0]==`<@${member_id}>`)?args[1]:args[0]) || 1;
    amount = parseInt(amount, 10);
    if(amount < 0)
        return `No puedes comprar una cantidad negativa de rolls.`
    const pluralRoll = amount > 1 ? 's' : '';
    const selfcheck = member.id_discord == player.id_discord
    const playercoins = player.coins;
    const cost = helpers.ROLL_PRICE * amount
    if( playercoins < cost)
        return `No tienes suficientes Ranitas para comprar ${amount} roll${amount > 1 ? 's' : ''}.`;
    let newcoinsamount = playercoins - cost;
    // We trim the new amount to avois precision errors  
    newcoinsamount = parseFloat(parseFloat(newcoinsamount).toFixed(2));
    player.coins = newcoinsamount;
    player.save();
    member.increment('rolls',{by: amount});
    const purchasedFor = selfcheck ? '' : ` para ${member.nombre}`;
    const response = `Comprado${pluralRoll} ${amount} roll${pluralRoll}${purchasedFor}.`;
    return  response;

}

module.exports = { buyrolls };