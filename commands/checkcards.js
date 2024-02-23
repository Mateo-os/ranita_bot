const { models } = require('../database');
const findplayer = require('./findplayer');
const {parseCartas} = require('../helpers/');

async function checkcards(player, message, args) {
    var selfcheck, member;
    try {
        const member_id = message.mentions.members.first().user.id;
        const server_id = message.guild.id;
        member = await findplayer(member_id, server_id);
    } catch (err) {
        selfcheck = true;
        member = player
    }
    const name = ((args[0] == `<@${member.id_discord}>`) ? args[1] : args[0]) || "";
    if ( name.length == 0){
        return [
            `No diste ningun nombre`
        ]
    }
    selfcheck = selfcheck || player.id_discord == member.id_discord;
    if (!member) return ['Ese usuario no tiene un perfil activo'];
    const cartas = member.cartas.filter(c => c.nombre.includes(name));
    if (cartas.length == 0) {
        return [
            `${selfcheck ? 'No tienes' : `<@${member.id_discord}> no tiene`} cartas con ese nombre o similares.`
        ];
    }
    const result = [];
    result.push(`Estas son ${selfcheck ? `tus cartas` : `las cartas de <@${member.id_discord}>`} similares a \"${name}\"`);
    result.push(parseCartas(cartas, showRepeats = true));
    return result;
}

module.exports = checkcards;