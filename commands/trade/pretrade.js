const helpers = require('../../helpers');
const { findplayer  } = require('../findplayer.js')
const { retrieve} = require('./retrieve.js');

async function pretrade(player, message, args){
    const mentionedMember = message.mentions.members.first();
    const result = [];
    if (!mentionedMember){
        result.push(`Debes mencionar a otro usuario`,[], [], []);
        return result;
    }
    const member_id = mentionedMember.user.id
    const server_id = message.guild.id;
    /*if (member_id === player.id_discord){
        result.push(`No puedes tradear contigo mismo`,[], [], []);
        return result;
    }
    */
    const member = await findplayer(member_id, server_id);
    //Remome ids mentions using regular expressions
    const name = (args.join(' ').replace(/<(@[0-9]+)>/g, '')).trim() || "";
    if( name.length == 0){
        result.push(`No diste ningun nombre`,[], [], []);
        return result;
    }
    
    const filter = c => new RegExp(name, 'i').test(c.nombre);
    [cards,parsedCards] = retrieve(player,filter);
    if (cards.length == 0) {
        result.push(
            'No tienes cartas con ese nombre o similares.',
            [], [], []
        );
        return result;

    }
    
    const response = cards.length > 1 ? `Estas son tus cartas similares a \"${name}\".` : 
                        `Vas a intercambiar a ${cards[0].nombre}`
    result.push(response);
    result.push(cards);
    result.push(parsedCards);
    result.push(member);
    return result;
}

module.exports = {pretrade};