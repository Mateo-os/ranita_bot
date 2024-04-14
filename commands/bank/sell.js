const helpers = require('../../helpers'); 
const { retrieve } = require('../retrieve.js');

async function presell(player, message, args){
    const result = [];
    //Remome ids mentions using regular expressions
    const name = (args.join(' ').replace(/<(@[0-9]+)>/g, '')).trim() || "";
    if (name.length == 0) {
        result.push(`No diste ningun nombre`, [], []);
        return result;
    }
    const filter = c => new RegExp(helpers.escapeRegExp(name), 'i').test(c.nombre);
    [cards, parsedCards] = retrieve(player, filter);
    if (cards.length == 0) {
        result.push(
            'No tienes cartas con ese nombre o similares.',
            [], []
        );
        return result;
    }
    if (cards.length > 24) {
        result.push(
            'Tiene muchas cartas con ese nombre o similares, por favor se mas especifico.',
            [], []
        );
        return result;
    }

    const response = cards.length > 1 ? `Estas son tus cartas similares a \"${name}\".` :
        `Comprada ${cards[0].nombre} a ${player.nombre} por ${helpers.sell_price[cards[0].rareza]} Ranitas.`
    result.push(response);
    result.push(cards);
    result.push(parsedCards);
    return result;
}

async function sell(player,bank,card_id,response){
    result = [];
    const card = player.cartas.find(c => c.id == card_id);
    const sell_price = helpers.sell_price[card.rareza];
    if(card.Cromo.cantidad == 1){
        await card.Cromo.destroy();
    }else{
        await card.Cromo.decrement({'cantidad':1});
    }
    const playercoins = player.coins;
    const newamount = parseFloat((playercoins + sell_price).toFixed(2));
    player.coins = newamount;
    await player.save();
    const op = await bank.addCarta(card);
    if(!op){
        return "Ha ocurrido un error."
    }
    if (response)
        result.push(`Comprada ${card.nombre} a ${player.nombre} por ${sell_price} Ranitas.`);
    return result;

}


module.exports = {
    presell,
    sell
}