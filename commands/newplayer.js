const {models} = require('../database');

async function newplayer(message) {
    message.channel.send("Hola noob ahi te creo un perfil\n");
    //Discord API bug, the globalName and username are switched
    const new_player = await models.Jugador.create({
        nombre: message.author.globalName,
        id_discord: message.author.id,
        id_servidor: message.guild.id,
    });
    new_player.cartas = []
    message.channel.send('Bienvenido al juego ' + new_player.nombre.toUpperCase());
    return new_player;
}

module.exports = {newplayer};