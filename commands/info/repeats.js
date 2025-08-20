const helpers = require("../../helpers");
const {findplayer} = require("../findplayer.js");


async function repeats(player, message) {
    let user = null;
    try{
        if(message.mentions.members.first()){
            user = await findplayer(message.mentions.members.first().user.id, message.guild.id);
        } else {
            user = player;
        }
    } catch(e){
        console.log(e);
        return ["Ha ocurrido un error", []];
    } 
    const cards = user.cartas.filter(c => c.Cromo.cantidad > 1).slice();
    const selfcheck = (player.id_discord == user.id_discord);
    if (!cards.length){
        const response =  selfcheck ? "No posees duplicados": `${user.nombre} no posee duplicados`
        return [response, []];
    }
    cards.sort((c1,c2) => { return helpers.orderCards(c1,c2)});
    const header = selfcheck ? `Estas son tus cartas duplicadas: \n`:
        `Estas son las cartas duplicadas de ${user.nombre}: \n`;
    return [header,helpers.parseCartas(cards,true)];
}

module.exports = {repeats};