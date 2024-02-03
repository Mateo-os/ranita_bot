const {models} = require('../database');

async function newPlayer(message) {
    message.channel.send("Hola noob ahi te creo un perfil\n");
    const new_player = await models.Jugador.create({
        nombre: message.author.username,
        id_discord: message.author.id,
        id_servidor: message.guild.id,
    });
    new_player.cartas = []
    message.channel.send('Bienvenido al juego ' + new_player.nombre.toUpperCase());
    return new_player;
}

module.exports = newPlayer;