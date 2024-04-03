const { recycle_points, parseCartas } = require('../../helpers');
const ROLL_VALUE = 10;


function separateStringsAndNumbers(input) {
    // Regular expression to match alphanumeric strings and numbers wrapped in angle brackets
    const names_regex = /[\w\s]+(?=\s*<\d+>\s*|$)/g; // Updated regex to match alphanumeric strings not followed by numbers in angle brackets

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
    for (let i = 0; i < recycle_names.length; i++) {
        const name = recycle_names[i];
        // Filter by name but also ignoring rare 6 cards.
        const canRecycle = c => (new RegExp(name, 'i').test(c.nombre)) && (c.rareza < 6);
        const cards = player.cartas.filter(canRecycle);
        if (cards.length == 0) {
            response += `No tienes cartas reciclables con el nombre \"${name}\" nombre o similares.\n`
            continue;
        }
        if (cards.length > 1) {
            response += `Estas son tus reciclables cartas similares a \"${name}\:"\n`;
            response += parseCartas(cards, showRepeats = true)
            response += `Por favor especifica.\n`;
            continue;
        }
        const card = cards[0];
        const recycle_amount = i < recycle_amounts.length ? recycle_amounts[i] : card.Cromo.cantidad - 1;
        if (card.Cromo.cantidad < recycle_amount) {
            response += `Tienes menos copias reciclables de la carta ${card.nombre} que las que has indicado para reciclar.\n`;
            continue;
        }
        const awarded_points = recycle_amount * recycle_points[card.rareza];
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
    const rem = player_points % ROLL_VALUE;
    const rolls = (player_points - rem) / ROLL_VALUE;
    await player.increment({ 'rolls': rolls });
    player.recycle_points = rem;
    player.save();
    response += `Entregados ${rolls} roll${rolls > 1 ? 's' : ''}.\n`;
    response += `Puntos restantes: ${rem}.\n`;
    return response
}

module.exports = { recycle };