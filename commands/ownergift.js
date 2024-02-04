require('dotenv').config();
const {models} = require('../database');

const owner = process.env.IDOWNER;

async function ownerrolls(message, args){
    if (message.author.id != owner) return ["No sos el owner."];
    if (!message.mentions) return ["No mencionaste jugador."];
    try {
        const member = message.mentions.members.first().user.id;
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

/*require('dotenv').config();
const findplayer = require("./findplayer.js");

const owner = process.env.IDOWNER;

async function ownerrolls(message, args){
    let responses= [];
    if (message.author.id != owner){responses.push(["No sos el owner."]); return responses;}
    if (!message.mentions)return [`No mencionaste jugador.`];
    try {
        const member = message.mentions.members.first().user.id;
        const row = await findplayer(member,message.guild.id);
        let rolls=(args[0]==`<@${member}>`)?args[1]:args[0];
        row.increment('rolls',{'by':rolls});
        responses.push(`<@${member}> se le regalo ${rolls} roll/s.`);
        return responses;
    } catch(err) {
        console.error(err);
    }
}

module.exports = {ownerrolls}; */