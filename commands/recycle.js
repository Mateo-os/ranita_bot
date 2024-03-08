const {recycle_points} = require('../helpers/constants');
const ROLL_VALUE = 10;

async function recycle(player, args){
    const result = [];
    const regex = /<(\d+)>|[^<>]+/g;
    //Just in case we eliminate discord ids
    const args_string = (args.join(' ').replace(/<(@[0-9]+)>/g, '')).trim() || "";
    // Match for ammount of cards to recycle.
    const matches = args_string.match(regex);
    const recycle_amounts = matches.filter(match => /^\d+$/.test(match)); // Filter out only the matched numbers
    // This are the names of cards to recycle
    const recycle_names = matches.filter(match => !/^\d+$/.test(match)); // Filter out non-matched substringsif ( card_id.length == 0){
    if (!recycle_names.length){
       return [
        "No has dado ningún nombre"
       ] 
    }
    let points = 0;
    for (let i = 0; i < recycle_names.length; i++){
        const name = recycle_names[i];
        // Filter by name but also ignoring rare 6 cards.
        const cards = player.cartas.filter(c => (new RegExp(name, 'i').test(c.nombre)) && c.rareza < 6);
        if (cards.length == 0){
            result.push(`No tienes cartas reciclables con el nombre \"${name}\" nombre o similares.\n`);
            continue;
        }
        if (cards.length > 1){
            result.push(`Estas son tus cartas similares a \"${name}\".`);
            result.push(parseCartas(cards));
            result.push(`Por favor especifica.\n`);
            continue;
        }
        const card = cards[0];
        const recycle_amount = i < recycle_amounts.length ? recycle_amounts[i] : card.Cromo.cantidad - 1;
        if (card.Cromo.cantidad < recycle_amount){
            result.push(`Tienes menos copias reciclables de la carta ${name} que las que has indicado para reciclar.\n`);
            continue;
        }
        const awarded_points = recycle_amount * recycle_points[card.rareza];
        points += awarded_points
        await card.Cromo.decrement({'cantidad':recycle_amount});
        card.save();
        result.push(`Recicladas ${recycle_amount} copia${recycle_amount > 1?'s':''} de la carta ${name}, por un valor de ${awarded_points} punto${awarded_points > 1?'s':''}.\n`);
    }
    const player_points = player.recycle_points + points;
    const rem = player_points % ROLL_VALUE;
    const rolls = (player_points - rem)/ROLL_VALUE;
    await player.increment({'rolls':rolls});
    player.recycle_points = rem;
    player.save();
    result.push(`Entregados ${rolls} roll${rolls > 1?'s':''}`);
    result.push(`Puntos restantes: ${rem}.`);
    return result
}

module.exports = {recycle};