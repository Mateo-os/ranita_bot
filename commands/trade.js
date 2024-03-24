const {MessageCollector,EmbedBuilder} = require('discord.js');
const { parseCartas } = require('../helpers');


async function trade(player, message, args){
    const mentionedMember = message.mentions.members.first();
    const result = [];
    if (!mentionedMember){
        result.push(`Debes mencionar a otro usuario`,[]);
        return result;
    }
    const member = await findplayer(member_id, server_id);
    const member_id = mentionedMember.user.id
    const server_id = message.guild.id;
    //Remome ids mentions using regular expressions
    const name = (args.join(' ').replace(/<(@[0-9]+)>/g, '')).trim() || "";
    if( name.length == 0){
        result.push(`No diste ningun nombre`,[]);
        return result;
    }
    
    const cards = player.cartas.cartas.filter(c => new RegExp(cardName, 'i').test(c.nombre));
    const text = parseCartas(cards,showRepeats = true)
 
    const embed = new EmbedBuilder().setDescription(text)
    await message.channel.send({embeds: [embed]});
}

module.exports = {trade};