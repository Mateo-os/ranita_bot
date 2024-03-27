const { models } = require('../../database.js');
async function trade(player1,card1,player2,card2){
    // player1 has card1 and player2 has card2, we remove them from their respective
    // invetories
    if(card1.Cromo.cantidad == 1){
        await card1.Cromo.destroy();
    } else {
        await card1.Cromo.decrement({'cantidad':1});
    }
    if (card2.Cromo.cantidad == 1) {
        await card2.Cromo.destroy();
    } else{
        await card2.Cromo.decrement({'cantidad':1});
    }
    card1.save();
    card2.save();

    // Check if the players already have 
    // copies of the cards.
    // If not, we add them
    const crd2 = player1.cartas.find(c => c.id == card2.id);
    let op1,op2;
    if(crd2){
        crd2.Cromo.increment('cantidad');
        crd2.save();
    } else{
        op1 = await player1.addCarta(card2);
    }
    
    const crd1 = player2.cartas.find(c => c.id == card1.id);
    if(crd1){
        crd1.Cromo.increment('cantidad');
        crd1.save();  
    } else{
        op2 = await player2.addCarta(card1);
    }
    player1.save();
    player2.save();
    if(op1 && op2){
        return `Se ha intercambiado a ${card1.nombre} por ${card2.nombre} exitosamente.`;
    }
    return `Ha habido un error en el intercambio.`;
}

module.exports = {
    trade
}