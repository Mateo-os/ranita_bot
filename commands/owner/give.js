const { models } = require('../../database');
const { findplayer } = require('../findplayer');
const { config } = require('../../config/config.js');
const owner = config.owner;

async function give(player, message, args){
    if (message.author.id != owner) return ["No sos el owner."];
    const mentionedMember = message.mentions.members.first();
    const member_id = mentionedMember ? mentionedMember.user.id : player.id_discord;
    const server_id = message.guild.id;
    const member = await findplayer(member_id, server_id);
    const card_id = (args.join(' ').replace(/<@[0-9]+>/, '')).replace(/[^0-9]/g,'').trim() || "";
    if ( card_id.length == 0){
        return [
            `No diste ningun id`
        ]
    }
    if (!member) return ['Ese usuario no tiene un perfil activo'];
    const card = await models.Carta.findOne({
        where: { id: parseInt(card_id) }
    });
    if (!card){
        return [
            "No se encontró la carta"
        ];
    }

    const playerCard = member.cartas.find(c => c.id == card_id);
    if (playerCard){
        playerCard.Cromo.increment('cantidad');
        playerCard.save();
    } else {
        member.addCarta(card);
    }
    return [`Se le ha otorgado ${card.nombre} a ${member.nombre}`];
}

module.exports = { give };