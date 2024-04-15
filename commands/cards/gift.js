const helpers = require('../../helpers'); 
const { retrieve } = require('../retrieve.js');
const { findplayer } = require('../findplayer.js');
async function pregift(player, message, args){
    const mentionedMember = message.mentions.members.first();
    const result = [];
    if (!mentionedMember) {
        result.push(`Debes mencionar a otro usuario`, [], [], []);
        return result;
    }
    const member_id = mentionedMember.user.id
    const server_id = message.guild.id;
    if (member_id === player.id_discord) {
        result.push(`No puedes regalarte cartas a ti mismo`, [], [], []);
        return result;
    }

    const member = await findplayer(member_id, server_id);
    //Remome ids mentions using regular expressions
    const name = (args.join(' ').replace(/<(@[0-9]+)>/g, '')).trim() || "";
    if (name.length == 0) {
        result.push(`No diste ningun nombre`, [], [], []);
        return result;
    }

    const filter = c => new RegExp(helpers.escapeRegExp(name), 'i').test(c.nombre);
    [cards, parsedCards] = retrieve(player, filter);
    if (cards.length == 0) {
        result.push(
            'No tienes cartas con ese nombre o similares.',
            [], [], []
        );
        return result;
    }

    if (cards.length > 24) {
        result.push(
            'Tiene muchas cartas con ese nombre o similares, por favor se mas especifico.',
            [], [], []
        );
        return result;
    }

    const response = cards.length > 1 ? `Estas son tus cartas similares a \"${name}\".` :
        `Se le regaló ${cards[0].nombre} a ${member.nombre}.`
    result.push(response);
    result.push(cards);
    result.push(parsedCards);
    result.push(member);
    return result;
}

async function gift(player1,player2,card_id,response)
{
    result = []
    card = player1.cartas.find(c => c.id == card_id);
    if(card.Cromo.cantidad == 1){
        await card.Cromo.destroy();
    }else{
        await card.Cromo.decrement({'cantidad':1});
    }
    const op = await player2.addCarta(card);
    if(!op)
        return "Ha ocurrido un error."
    if (response)
        result.push(`Se le regaló ${card.nombre} a ${player2.nombre}.`);
    return result;
}

module.exports = {pregift, gift}