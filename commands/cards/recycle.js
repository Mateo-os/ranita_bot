const helpers = require('../../helpers');
const { retrieve } = require('../retrieve.js');

function separateStringsAndNumbers(input) {
    // Regular expression to match alphanumeric strings and numbers wrapped in angle brackets
    // EX: Foo <4> Bar <7>
    const names_regex = /[\w\s]+(?=\s*<\d+>\s*|$)/g;

    const number_regex = /<(\d+)>/g;
    const alphanumericMatches = [];
    const numericMatches = [];

    let match;
    while ((match = names_regex.exec(input)) !== null) {
        alphanumericMatches.push(match[0].trim());
    }

    while ((match = number_regex.exec(input)) !== null) {
        numericMatches.push(parseInt(match[1]));
    }
    return [alphanumericMatches, numericMatches];
}


async function recycle(player, args) {
    const args_string = (args.join(' ').replace(/<(@[0-9]+)>/g, '')) || "";
    const [recycle_names, recycle_amounts] = separateStringsAndNumbers(args_string);
    if (!recycle_names.length) {
        return [
            "No has dado ningún nombre.\n"
        ]
    }
    let points = 0;
    let response = ''
    const cards = player.cartas
    for (let i = 0; i < recycle_names.length; i++) {
        const name = recycle_names[i];
        // Filter by name but also ignoring rare 6 cards.
        const canRecycle = c => (new RegExp(name, 'i').test(c.nombre)) && (c.rareza < 6);
        matchedCards = cards.filter(canRecycle); 
        if (matchedCards.length == 0) {
            response += `No tienes cartas reciclables con el nombre \"${name}\" nombre o similares.\n`
            continue;
        }
        if (matchedCards.length > 1) {
            response += `Estas son tus reciclables cartas similares a \"${name}\:"\n`;
            response += helpers.parseCartas(matchedCards, showRepeats = true)
            response += `Por favor especifica.\n`;
            continue;
        }
        const card = matchedCards[0];
        const recycle_amount = i < recycle_amounts.length ? recycle_amounts[i] : card.Cromo.cantidad - 1;
        if(recycle_amount == 0){
            response += `Solamente tienes una copia de la carta ${card.nombre}. Para reciclarla, indicalo explicitamente.\n`;
            continue;
        }
        if (card.Cromo.cantidad < recycle_amount) {
            response += `Tienes menos copias reciclables de la carta ${card.nombre} que las que has indicado para reciclar.\n`;
            continue;
        }
        const awarded_points = recycle_amount * helpers.recycle_points[card.rareza];
        points += awarded_points
        if (card.Cromo.cantidad == recycle_amount) {
            await card.Cromo.destroy()
        } else {
            await card.Cromo.decrement({ 'cantidad': recycle_amount });
        }
        await card.save();

        response += `Recicladas ${recycle_amount} copia${recycle_amount > 1 ? 's' : ''} de la carta ${card.nombre}, por un valor de ${awarded_points} punto${awarded_points > 1 ? 's' : ''}.\n`;
    }
    const player_points = player.recycle_points + points;
    const rem = player_points % helpers.REC_POINTS_PER_ROLL;
    const rolls = (player_points - rem) / helpers.REC_POINTS_PER_ROLL;
    await player.increment({ 'rolls': rolls });
    player.recycle_points = rem;
    player.save();
    response += `Entregados ${rolls} roll${rolls > 1 ? 's' : ''}.\n`;
    response += `Puntos restantes: ${rem}.\n`;
    return response
}

module.exports = { recycle };