const helpers = require('../helpers');
const { models } = require('../database.js');
const { literal } = require('sequelize');


async function roll(player) {
    if (player.rolls + player.freerolls <= 0)
        return [];
    const pulled_cards = {};
    for (i = 0; i < helpers.CARDS_PER_ROLL; i++) {
        let random = Math.floor(Math.random() * 1000);
        if (random <= 1) rare = 5;
        else if (random <= 11) rare = 4;
        else if (random <= 71) rare = 3;
        else if (random <= 250) rare = 2;
        else rare = 1;
        const card = await models.Carta.findOne({
            where: { rareza: rare },
            order: literal("RAND()"),
        },);

        if (!(card.id in pulled_cards)) {
            pulled_cards[card.id] = {
                card: card,
                amount: 1
            };
        } else {
            pulled_cards[card.id].amount += 1;
        }
    }

    const pulled_cards_id = Object.keys(pulled_cards).map(id => parseInt(id));
    const repeated_cards = player.cartas.filter(c => pulled_cards_id.includes(c.id));
    const repeated_cards_id = repeated_cards.map(c => c.id);
    const new_cards_id = pulled_cards_id.filter(c_id => !repeated_cards_id.includes(c_id));
    repeated_cards.forEach(async c => {
        c.Cromo.increment('cantidad', {
            by: pulled_cards[c.id].amount
        });
        await c.Cromo.save()
    })
    new_cards_id.forEach(async c_id => {
        const c = await player.addCarta(pulled_cards[c_id].card, { through: { cantidad: pulled_cards[c_id].amount } });
        player.save();
    });

    if (player.freerolls <= 0)
        await player.decrement('rolls');
    else
        await player.decrement('freerolls');
    //TODO: check if this code can be improved
    // (player.cartas should be properly updted at this instance but its not)
    const result = [];
    pulled_cards_id.forEach(c_id => {
        const c = (player.cartas.find(c => c.id == c_id) || pulled_cards[c_id].card);
        for (let i = 0; i < pulled_cards[c_id].amount; i++)
            result.push(c);
    });
    return result;
}

module.exports = { roll };