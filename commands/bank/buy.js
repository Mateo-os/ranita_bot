const helpers = require('../../helpers'); 
const { retrieve } = require('../retrieve.js');
const { parseCartas } = require('./parse.js');
async function prebuy(bank, player,message, args){
    const result = [];
    //Remome ids mentions using regular expressions
    const name = (args.join(' ').replace(/<(@[0-9]+)>/g, '')).trim() || "";
    if (name.length == 0) {
        result.push(`No diste ningun nombre`, [], []);
        return result;
    }
    const filter = c => new RegExp(helpers.escapeRegExp(name), 'i').test(c.nombre);
    [cards, parsedCards] = retrieve(bank, filter,parseCartas);
    if (cards.length == 0) {
        result.push(
            'No hay cartas en el banco con ese nombre o similares.',
            [], []
        );
        return result;
    }
    if (cards.length > 24) {
        result.push(
            'Hay muchas cartas en el banco con ese nombre o similares, por favor se mas especifico.',
            [], []
        );
        return result;
    }

        
    const response = cards.length > 1 ? `Estas son las cartas del banco similares a \"${name}\".` : ``;
    result.push(response);
    result.push(cards);
    result.push(parsedCards);
    return result;
}
async function buy(player,bank,card_id,response){
    result = [];
    const card = bank.cartas.find(c => c.id == card_id);
    const buy_price = helpers.buy_price[card.rareza];
    const playercoins = player.coins
    if(playercoins < buy_price){
        result.push(`No tienes suficientes Ranitas para comprar ${card.nombre}`);
        return result;
    }
    if(card.Cromo.cantidad == 1){
        await card.Cromo.destroy();
    }else{
        await card.Cromo.decrement({'cantidad':1});
    }

    let newamount = parseFloat((playercoins - buy_price).toFixed(2))
    player.coins = newamount;
    const playercard = player.cartas.find(c => c.id == card_id);
    let op;
    if(!playercard)
        op = await player.addCarta(card);
    else 
        op = await playercard.Cromo.increment('cantidad');
    if(!op){
        return "Ha ocurrido un error."
    }
    result.push(`Vendida ${card.nombre} a ${player.nombre} por ${buy_price} Ranitas.`);
    return result;

}

module.exports = {
    prebuy,
    buy
}