const helpers = require('../../helpers');
const { models } = require('../../database.js');
const { literal } = require('sequelize');


async function roll(player,args) {
    const result = [];
    if (player.rolls + player.freerolls <= 0)
        return ['No tienes rolls.',result];
    let amount = ((args[0]==`<@${player.id_discord}>`)?args[1]:args[0]) || 1;
    amount = parseInt(amount, 10);
    if(isNaN(amount) || amount <= 0)
        return [`No ingresaste un número válido.`,result];
    amount = Math.min(amount,player.rolls + player.freerolls)    
    const pulled_cards = {};
    for (let j = 0; j < amount; j++) {
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
        await player.decrement({'rolls':amount});
    else if (player.freerolls > amount){
        await player.decrement({'freerolls':amount});
    }else{
        const remainder = amount - player.freerolls;
        player.freerolls = 0;
        await player.decrement({'rolls':remainder});
        await player.save()
    }
        //TODO: check if this code can be improved
    // (player.cartas should be properly updted at this instance but its not)
    pulled_cards_id.forEach(c_id => {
        const c = (player.cartas.find(c => c.id == c_id) || pulled_cards[c_id].card);
        for (let i = 0; i < pulled_cards[c_id].amount; i++)
            result.push(c);
    });
    return [`Estas son tus cartas`,result];
}

module.exports = { roll };