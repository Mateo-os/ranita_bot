const  helpers = require('../helpers');
const { models } = require('../database.js');
const { literal } = require('sequelize');


async function roll(player){
    if (player.rolls  + player.freerolls <= 0)
        return [];
    let new_cards = [];
    let card_ids = [];
    for (i = 0; i < helpers.CARDS_PER_ROLL; i++) {
        let random = Math.floor(Math.random() * 1000);
        if (random <= 1) rare = 5;
        else if (random <= 11) rare = 4;
        else if (random <= 71) rare = 3;
        else if (random <= 250) rare = 2;
        else rare = 1;
        card = await models.Carta.findOne({
            where: { rareza: rare },
            order: literal("RAND()"),
        },)
        new_cards.push(card);
        card_ids.push(card.id);
    }
    player.cartas.forEach(c => {
        if (card_ids.includes(c.id)) {
            c.Cromo.increment('cantidad');
            c.save();
        }
    })
    
    await player.addCartas(new_cards.filter(elem => !(elem.id in card_ids)));
    
    if(player.freerolls <= 0)
        await player.decrement('rolls');
    else
        await player.decrement('freerolls');
    //TODO: check if this code can be improved 
    // (player.cartas should be properly updted at this instance but its not)
    return new_cards.map(c => (player.cartas.find(elem => elem.id === c.id) || c))
}

module.exports = {roll};