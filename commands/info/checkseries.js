const { findplayer } = require('../findplayer');
const helpers = require('../../helpers');

async function checkseries(player, message, args) {
    const mentionedMember = message.mentions.members.first();
    const member_id = mentionedMember ? mentionedMember.user.id : player.id_discord;
    const server_id = message.guild.id;
    const member = await findplayer(member_id, server_id);
    const result = [];
    //Remome ids mentions using regular expressions
    const series = (args.join(' ').replace(/<@[0-9]+>/g, '')).trim() || "";
    if ( series.length == 0){
        result.push(`No diste ningun nombre`,[]);
        return result
    }
    const selfcheck = player.id_discord == member.id_discord;
    if (!member){
        result.push('Ese usuario no tiene un perfil activo',[]);
        return result;
    } 
    const cartas = member.cartas.filter(c => new RegExp(series, 'i').test(c.serie));
    if (cartas.length == 0) {
        result.push(
            `${selfcheck? 'No tienes' : `<@${member.id_discord}> no tiene`} cartas de esa serie o similares.`,
            []
        );
        return result;
    }
    cartas.sort((c1,c2) => { return helpers.orderCards(c1,c2)});
    result.push(`Estas son ${selfcheck ? `tus cartas` : `las cartas de <@${member.id_discord}>`} que pertenezcan a series similares a \"${series}\"`);
    result.push(helpers.parseCartas(cartas, showRepeats = true));
    return result;
}

module.exports = {checkseries};