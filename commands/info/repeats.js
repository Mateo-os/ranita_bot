const helpers = require("../../helpers");
const {findplayer} = require("../findplayer.js");

async function repeats(player, message) {
    const usuario = (message.mentions.members.first()) ?
        await findplayer(message.mentions.members.first().user.id, message.guild.id) : player;
    const cartas = usuario.cartas.filter(c => c.Cromo.cantidad > 1);
    const selfcheck = (player.id_discord == usuario.id_discord);
    const result = []; 
    if (!cartas.length){
        const response =  selfcheck ? "No posees duplicados": `${usuario.nombre} no posee duplicados`
        result.push(response,[]);
        return result;
    }
    cartas.sort((c1,c2) => { return helpers.orderCards(c1,c2)});
    const header = selfcheck ? `Estas son tus cartas duplicadas: \n`:
        `Estas son las cartas duplicadas de ${usuario.nombre}: \n`;
    result.push(header)
        return [header,helpers.parseCartas(cartas, showRepeats = true)];
}

module.exports = {repeats};