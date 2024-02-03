require('dotenv').config();
const {models} = require('../database');

const owner = process.env.IDOWNER;

async function ownerrolls(message, args){
    if (message.author.id != owner) return "No sos el owner.";
    try {
        const member = message.mentions.members.first().user.id;
        if (!member) return `No mencionaste jugador.`;
        const row = await models.Jugador.findOne({
            where:{id_discord:member}
        });
        let rolls=(args[0]==`<@${member}>`)?args[1]:args[0];
        row.increment('rolls',{'by':rolls});
        return `<@${member}> se le regalo ${rolls} roll/s.`;
    } catch(err) {
        console.error(err);
    }
}

module.exports = {ownerrolls};