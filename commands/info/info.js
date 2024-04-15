const { models } = require('../../database');
const { fn, col, Op} = require('sequelize');

async function info(player) {
    const result = [];
    const all_cards = await models.Carta.findAll({ 
        where: { 
            rareza: {
                [Op.lte]: 5,
            
            }
        },
    });
    const total_cards = all_cards.length;
    const card_agreggation = await models.Carta.findAll({
        attributes: ['rareza', [fn('COUNT', col('*')), 'count']],
        where: {
            rareza: {
                [Op.lte]: 5,
            }
        },
        group: ['rareza'],
    });

    card_agreggation.sort((a, b) => a.rareza - b.rareza);
    const cards = player.cartas.filter(c => c.rareza <= 5);
    const r6 = player.cartas.filter(c => c.rareza >= 6);
    const r6_sisters = r6.map(c => all_cards.find(cc => (cc.numero == c.numero) && (cc.serie == c.serie) && (cc.rareza < 6)));
    let inventory = cards.reduce((counts, carta) => {
        counts[carta.rareza] = (counts[carta.rareza] || 0) + 1;
        return counts;
    }, {});
    
    let card_count = cards.length;
    const repetidas = player.cartas.filter(c => c.Cromo.cantidad > 1);
    r6_sisters.forEach(c => {
        const card = cards.find(card => card.id == c.id);
        if(!card)
        {
            inventory[c.rareza] = (inventory[c.rareza] || 0) + 1;
            card_count += 1;
        }
    });
    const repeat_amount = repetidas.reduce((acc, carta) => acc + (carta.Cromo.cantidad - 1), 0);

    let info = "\`\`\`"
    info +=
        `Rolls: ${player.rolls}
Rolls efímeros: ${player.freerolls}
Ranitas: ${player.coins.toFixed(2)}
Puntos de reciclaje: ${player.recycle_points}
Cartas repetidas: ${repeat_amount}
Colección: ${card_count}/${total_cards}
Rarezas:\n`;
    card_agreggation.forEach(c => {
        info += `Rareza ${c.rareza}: ${inventory[c.rareza] || 0}/${c.get('count')}\n`;
    })
    info += '\`\`\`';
    result.push(`Hola ${player.nombre} estos son tus datos:\n`)
    result.push(info);
    return result;
}

module.exports = {info};