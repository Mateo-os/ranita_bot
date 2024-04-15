const {models} = require('../database');

const { createplayer } = require('./createplayer');
async function newplayer(message) {
    message.channel.send("Hola noob ahi te creo un perfil\n");
    //Discord API bug, the globalName and username are switched
    const new_player = await createplayer(
        message.author.globalName,
        message.author.id,
        message.guild.id
    );
    message.channel.send('Bienvenido al juego ' + new_player.nombre.toUpperCase());
    return new_player;
}

module.exports = {newplayer};