function info(responses, player){
    responses.push(`Hola ${player.nombre} estos son tus datos:\n`)
    const repetidas = player.cartas.filter(c => c.Cromo.cantidad > 1);
    const amount = repetidas.reduce((acc,carta) => acc + (carta.Cromo.cantidad - 1), 0);
    let info = `\`\`\`Rolls: ${player.rolls}\nCartas repetidas: ${amount}\`\`\``;
    responses.push(info);
}

module.exports = info;