const { models } = require('../database');
const { findplayer } = require('./findplayer');
const {parseCartas} = require('../helpers/');

async function checkseries(player, message, args) {
    const mentionedMember = message.mentions.members.first();
    const member_id = mentionedMember ? mentionedMember.user.id : player.id_discord;
    const server_id = message.guild.id;
    const member = await findplayer(member_id, server_id);
    //Remome ids mentions using regular expressions
    const series = (args.join(' ').replace(/<@![0-9]+>/, '')).trim() || "";
    if ( series.length == 0){
        return [
            `No diste ningun nombre`
        ]
    }
    const selfcheck = player.id == member.id_discord;
    if (!member) return ['Ese usuario no tiene un perfil activo'];
    const cartas = member.cartas.filter(c => new RegExp(series, 'i').test(c.serie));
    if (cartas.length == 0) {
        return [
            `${selfcheck ? 'No tienes' : `<@${member.id_discord}> no tiene`} cartas de esa serie o similares.`
        ];
    }
    const result = [];
    result.push(`Estas son ${selfcheck ? `tus cartas` : `las cartas de <@${member.id_discord}>`} que pertenezcan a series similares a \"${series}\"`);
    result.push(parseCartas(cartas, showRepeats = true));
    return result;
}

module.exports = {checkseries};