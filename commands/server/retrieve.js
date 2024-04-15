const {models} = require('../../database');

async function retrieve(){
    const players = await models.Jugador.findAll();
    const server_set = new Set(players.map(p => p.id_servidor))
    const servers = Array.from(server_set); 
    return servers
}

module.exports = {retrieve};