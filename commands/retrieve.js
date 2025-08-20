const helpers = require('../helpers');
function retrieve(player, filterpredicate = () => true, parseFunction=helpers.parseCartas){
    if(!player || !player.cartas || !Array.isArray(player.cartas)){
        return [[], []];
    }
    const cards = player.cartas.filter(filterpredicate);
    cards.sort( (c1,c2) =>  { return helpers.orderCards(c1,c2) } );
    return [ cards, parseFunction(cards,true)];
}

module.exports = { retrieve};