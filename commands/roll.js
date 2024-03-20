const { models } = require('../database.js');
const { literal } = require('sequelize');

const ROLL_SIZE = 3;

async function roll(player){
    if (player.rolls <= 0)
        return [];
    let new_cards = [];
    let card_ids = [];
    for (i = 0; i < ROLL_SIZE; i++) {
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
    
    player.addCartas(new_cards.filter(elem => !(elem.id in card_ids)));
    player.decrement('rolls');
    return new_cards;
}

module.exports = {roll};