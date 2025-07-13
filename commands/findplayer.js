const {models} = require('../database');
const { config } = require('../config/config');
async function findplayer(iduser, idserver,getbot = false){
    if(!getbot && iduser == config.botID())
        return null;

    let player = await models.Jugador.findOne({
        where:{
            id_discord:iduser,
            id_servidor:idserver,
        }, include:'cartas'
    });
    if (!player)
        return null;
    player = player.reload({
        include: 'cartas'
    }
    );
}

module.exports = {findplayer};