const helpers = require('../../helpers');
const {models} = require('../../database.js');
const { retrieve } = require('./retrieve.js');
async function asktrade( member,card1,card2name ) {
    const responses = [];
    const filter = c => new RegExp(card2name, 'i').test(c.nombre);
    const [cards,parsedCards] = retrieve(member,filter);
    if (!cards.length) {
        responses.push(
            'No tienes cartas con ese nombre o similares.',
            [], [], []
        );
        return responses;
    }
    const response = cards.length > 1 ? `Por favor especifica que carta intercambiar por ${card1.nombre}` : 
        `Vas a intercambiar a ${cards[0].nombre}`
    responses.push(response);
    responses.push(cards);
    responses.push(parsedCards);
    return responses;
}

module.exports = {
    asktrade
}