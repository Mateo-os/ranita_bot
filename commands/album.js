const parseCartas = require("./parse.js");

function album(player, responses){
    responses.push('Estas son tus cartas totales: \n');
    responses.push(parseCartas(player.cartas,showRepeats=true));
}

module.exports = album;