const parseCartas = require("./parse.js");
const {models} = require('../database.js');

function album(player, message){
    /*const responses = [];
    responses.push(`Estas son las cartas totales de : \n`);
    responses.push(parseCartas(player.cartas,showRepeats=true));*/
    return [`Estas son las cartas totales de : \n`,
    parseCartas(player.cartas,showRepeats=true)];
}

module.exports = album;