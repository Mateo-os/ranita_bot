const {models} = require('../database');
const { config } = require('../config/config');
async function findplayer(iduser, idserver,getbot = false){
    if(!getbot && iduser == config.botID())
        return null;
    return await models.Jugador.findOne({
        where:{
            id_discord:iduser,
            id_servidor:idserver,
        }, include:'cartas'
    });
}

module.exports = {findplayer};