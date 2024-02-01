const {models} = require('../database');

async function info(player){
    const result = []
    const total_cards = await models.Carta.count();
    console.log(total_cards);
    result.push(`Hola ${player.nombre} estos son tus datos:\n`)
    const repetidas = player.cartas.filter(c => c.Cromo.cantidad > 1);
    const amount = repetidas.reduce((acc,carta) => acc + (carta.Cromo.cantidad - 1), 0);
    let info = `\`\`\`Rolls: ${player.rolls}\nCartas repetidas: ${amount}\`\`\``;
    result.push(info)
    return(result);
}

module.exports = info;