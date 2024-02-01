const {models} = require('../database');

async function incrementElement(amount=1) {
    try {
      const row = await models.Jugador.findAll();
      if (row) {
        row.forEach(element => {
            element.increment('rolls',{'by':amount});
            element.save();
        });
        console.log('Element incremented successfully.');
      }
    } catch (error) {
      console.error('Error incrementing element:', error);
    }
}

module.exports = incrementElement;