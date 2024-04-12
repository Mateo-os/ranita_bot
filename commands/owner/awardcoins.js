const { findplayer } = require('../findplayer.js');
const { config } = require('../../config/config.js');
const owner = config.owner;

async function awardcoins(message, args) {
    if (message.author.id != owner) return ["No sos el owner."];
    if (!message.mentions.members.first()) return ["No mencionaste jugador."];
    try {
        const member = message.mentions.members.first().user.id;
        const player = await findplayer(member, message.guild.id);
        if (!player) return ["Esta persona no tiene un perfil creado"]
        let amount = (args[0] == `<@${member}>`) ? args[1] : args[0];
        player.increment('coins', { 'by': amount });
        let response;
        if(amount >= 0){
            response = `Regalada${amount > 1 ? 's' : ''} ${amount} Ranita${amount > 1 ? 's' : ''} a <@${member}>.`
        }else{
            response = `Quitada${amount < -1 ? 's' : ''} ${-1 * amount} Ranita${amount < -1 ? 's' : ''} de <@${member}>.`
        }
        return  response;
    } catch (err) {
        console.error(err);
    }
}

module.exports = { awardcoins };