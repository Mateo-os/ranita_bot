const {models} = require('../database.js');
const parseCartas = require("./parse.js");
const {literal} = require('sequelize');
const show = require("./show.js");

async function roll(player){
    const result = []
    if(player.rolls <= 0){
        return ['No tienes rolls'];
    }
    let new_cards = [];
    let card_ids = []; 
    for (i=0;i<5;i++){
        let random = Math.floor(Math.random()*1000);
        if (random <=4) rare = 5;
        else if (random <= 30) rare = 4;
        else if (random <= 100) rare = 3;
        else if (random <= 300) rare = 2;
        else rare = 1;
        card = await models.Carta.findOne({
            where:{rareza:rare},
            order:literal("RAND()"),
        },)
        new_cards.push(card);
        card_ids.push(card.id);              
    }
    player.cartas.forEach(c =>{
        if(card_ids.includes(c.id)){
            c.Cromo.increment('cantidad');
            c.save();
        }
    })
    player.addCartas(new_cards.filter(elem => !(elem.id in card_ids)));
    player.decrement('rolls');
    return([parseCartas(new_cards)]);
}

module.exports = roll;