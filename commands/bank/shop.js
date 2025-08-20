const helpers = require('../../helpers');
const { get } = require('./get.js');
const { parseCartas } = require('./parse.js');
async function shop(message){
    const bank = await get(message.guild.id);
    responses = [];
    if (!bank) {
        responses.push("Ocurrió un error en el banco. No esta inicializado.",[]);
        return responses;
    }
    const cards = bank.cartas.slice();
    if(!cards.length){
        responses.push("El banco no tiene cartas actualmente en venta.",[]);
        return responses;
    }
    cards.sort((a,b) =>  helpers.orderCards(a,b));
    const parsedCards = parseCartas(cards);
    responses.push("Estas son las cartas en venta:")
    responses.push(parsedCards);
    return responses;
}

module.exports = {
    shop,
}