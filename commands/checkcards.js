const { models } = require('../database');
const { findplayer} = require('./findplayer');
const {parseCartas} = require('../helpers/');

async function checkcards(player, message, args) {
    const mentionedMember = message.mentions.members.first();
    const member_id = mentionedMember ? mentionedMember.user.id : player.id_discord;
    const server_id = message.guild.id;
    const member = await findplayer(member_id, server_id);
    //Remome ids mentions using regular expressions
    const name = (args.join(' ').replace(/<(@[0-9]+)>/g, '')).trim() || "";
    console.log(name);
    if ( name.length == 0){
        return [
            `No diste ningun nombre`
        ]
    }
    const selfcheck = player.id_discord == member.id_discord;
    if (!member) return ['Ese usuario no tiene un perfil activo'];
    const cartas = member.cartas.filter(c => new RegExp(name, 'i').test(c.nombre));
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

module.exports = {checkcards};