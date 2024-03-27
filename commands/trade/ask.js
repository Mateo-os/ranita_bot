const helpers = require('../../helpers');
const {models} = require('../../database.js');
const { retrieve } = require('./retrieve.js');
async function asktrade( member, cardID ) {
    const responses = [];
    const card = await models.Carta.findOne({where:{id: cardID}});
    const response = `Hola <@${member.id_discord}>, por favor elige que carta intercambiar por ${card.nombre}`;
    const [cards,parsedCards] = retrieve(member);
    responses.push(response);
    responses.push(cards);
    responses.push(parsedCards);
    return responses;
}

module.exports = {
    asktrade
}