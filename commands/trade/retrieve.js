const helpers = require('../../helpers');
function retrieve(player, filterpredicate = () => true){
    const cards = player.cartas.filter(filterpredicate);
    cards.sort( (c1,c2) =>  { return helpers.orderCards(c1,c2) } );
    return [ cards, helpers.parseCartas(cards,true)];
}

module.exports = { retrieve};