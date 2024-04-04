const { findplayer } = require('../findplayer.js');
const config = require('../../config/config.js');
const owner = config.owner;

async function award(message, args) {
    if (message.author.id != owner) return ["No sos el owner."];
    if (!message.mentions.members.first()) return ["No mencionaste jugador."];
    try {
        const member = message.mentions.members.first().user.id;
        const player = await findplayer(member, message.guild.id);
        if (!player) return ["Esta persona no tiene un perfil creado"]
        let rolls = (args[0] == `<@${member}>`) ? args[1] : args[0];
        player.increment('rolls', { 'by': rolls });
        return `<@${member}> se le regalo ${rolls} roll${rolls > 1 ? 's' : ''}.`;
    } catch (err) {
        console.error(err);
    }
}

module.exports = { award };