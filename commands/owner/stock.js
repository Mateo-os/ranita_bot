const { models } = require('../../database');
const _bank = require('../bank');
const { config } = require('../../config/config.js');
const owner = config.owner;

async function stock(player, message, args){
    if (message.author.id != owner) return ["No sos el owner."];
    const server_id = message.guild.id;
    const bank = await _bank.get(server_id);
    const card_id = (args.join(' ').replace(/<@[0-9]+>/, '')).replace(/[^0-9]/g,'').trim() || "";
    if ( card_id.length == 0){
        return [
            `No diste ningun id`
        ]
    }
    if (!bank) return ['Hubo un problema con el banco.'];
    const card = await models.Carta.findOne({
        where: { id: parseInt(card_id) }
    });
    if (!card){
        return [
            "No se encontró la carta"
        ];
    }

    const bankCard = bank.cartas.find(c => c.id == card_id);
    if (bankCard){
        bankCard.Cromo.increment('cantidad');
        bankCard.save();
    } else {
        bank.addCarta(card);
    }
    return [`Se ha agregado ${card.nombre} a el inventario del Banco.`];
}

module.exports = { stock };