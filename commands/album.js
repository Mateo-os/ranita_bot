const parseCartas = require("./parse.js");

function album(player){
    const responses = []
    responses.push('Estas son tus cartas totales: \n');
    responses.push(parseCartas(player.cartas,showRepeats=true));
    return responses;
}

module.exports = album;