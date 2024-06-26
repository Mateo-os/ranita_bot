const helpers = require('../../helpers');


async function scrap(player, args) {
    let result = '';
    if (args.length < 0 || isNaN(parseInt(args[0]))) return ['No ingresaste ninguna rareza.'];
    const rarity = parseInt(args[0]);
    if (rarity < 1 || rarity > 6) return ['Ingresa una rareza válida.'];
    if (rarity == 6) return ['No puedes reciclar cartas de rareza 6.'];
    const cards = player.cartas.filter(c => (c.rareza == rarity) && (c.Cromo.cantidad > 1));
    let points = 0;
    cards.forEach(card => {
        const recycle_amount = card.Cromo.cantidad - 1;
        const awarded_points = recycle_amount * helpers.recycle_points[card.rareza];
        points += awarded_points
        card.Cromo.cantidad = 1;
        card.Cromo.save();
        card.save();
        result += `Reciclada${recycle_amount > 1 ? 's' : ''} ${recycle_amount} copia${recycle_amount > 1 ? 's' : ''} de la carta ${card.nombre}, por un valor de ${awarded_points} punto${awarded_points > 1 ? 's' : ''}.\n`;
    });
    const player_points = player.recycle_points + points;
    const rem = player_points % helpers.REC_POINTS_PER_ROLL;
    const rolls = (player_points - rem) / helpers.REC_POINTS_PER_ROLL;
    await player.increment({ 'rolls': rolls });
    player.recycle_points = rem;
    player.save();
    result += `Entregados ${rolls} roll${rolls > 1 ? 's' : ''}.\n`;
    result += `Puntos restantes: ${rem}.\n`;
    return [result]
}

module.exports = { scrap };