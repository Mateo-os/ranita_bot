const {models} = require('../database');

async function findplayer(iduser, idserver){
    return await models.Jugador.findOne({
        where:{
            id_discord:iduser,
            id_servidor:idserver,
        }, include:'cartas'
    });
}

module.exports = findplayer;