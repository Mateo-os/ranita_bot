const {models} = require('../database');
const {fn,col} = require('sequelize');

async function info(player){
    const result = [];
    const total_cards = await models.Carta.count();
    const cardQuery = await models.Carta.findAll({
        attributes: ['rareza', [fn('COUNT', col('*')), 'count']],
        group: ['rareza'],
    });

    let cardCounts = cardQuery.map( c => c.toJSON())
    cardCounts.sort((a,b) => a.rareza - b.rareza);
    const inventory = player.cartas.reduce((counts, carta) => {
        counts[carta.rareza] = (counts[carta.rareza] || 0) + 1;
        return counts;
    }, {});  
    const repetidas = player.cartas.filter(c => c.Cromo.cantidad > 1);
    const repeat_amount = repetidas.reduce((acc,carta) => acc + (carta.Cromo.cantidad - 1), 0);
    
    let info = `\`\`\`Rolls: ${player.rolls}\nCartas repetidas: ${repeat_amount}\nColección: ${player.cartas.length}/${total_cards}\n`;
    info += 'Rarezas:\n'
    cardCounts.forEach(c =>{
        info += `Rareza ${c.rareza}: ${inventory[c.rareza] || 0}/${c.count}\n`;
    })
    info += '\`\`\`';
    result.push(`Hola ${player.nombre} estos son tus datos:\n`)
    result.push(info);
    return result;
}

module.exports = info;