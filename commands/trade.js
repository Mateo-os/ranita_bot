const {MessageCollector,EmbedBuilder} = require('discord.js');
const { parseCartas } = require('../helpers');


async function trade(player, message, args){

    const text = parseCartas(player.cartas.slice(0,2),showRepeats = true)
 
    const embed = new EmbedBuilder().setDescription(text)
    await message.channel.send({embeds: [embed]});
}

module.exports = {trade};