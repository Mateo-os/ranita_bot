const {models} = require('../database');
const findplayer = require('./findplayer');
const parse = require('./parse');

async function checkcard(player,message,args){
    const member_id = message.mentions.members.first().user.id;
    const server_id = message.guild.id
    if (!member_id) return [`No mencionaste jugador.`];
    const name=(args[0]==`<@${member_id}>`)?args[1]:args[0];
    const member = await findplayer(member_id,server_id)
    if (!member) return ['Ese usuario no tiene un perfil activo'];
    const cartas = member.cartas.filter(c => c.nombre.includes(name));
    const selfcheck = player.discord_id == member_id; 
    if (!cartas.length) {
        return [
            `${selfcheck ? 'No tienes':`<@${member_id}> no tiene`} cartas con ese nombre o similares.`
        ];
    }
    const result = [];
    result.push(`Estas son ${selfcheck?`tus cartas`:`las cartas de <@${member_id}>`} similares a \"${name}\"`);
    result.push(parse(cartas));
    return result;
}

module.exports = checkcard;