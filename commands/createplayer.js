const {models} = require('../database');
const {config} = require('../config/config');

async function createplayer(name,player_id,server_id,bot=false) {
    const initial_rolls = config.serverConfig[server_id].INITIALROLLS 
    const new_player = await models.Jugador.create({
        nombre: name,
        id_discord: player_id,
        id_servidor: server_id,
        rolls: bot? 0 : initial_rolls
    });
    new_player.cartas = []
    return new_player;
}

module.exports = {createplayer};