const {models} = require('../../database');
const helpers = require('../../helpers');

async function assignfreerolls(amount=1) {
  try {
    const playerList = await models.Jugador.findAll();
    let gifted = 0;
    playerList.forEach(p  => {
        if(p.freerolls >= helpers.EPHIMERAL_ROLL_LIMIT)
          return;
        p.increment('freerolls',{'by':amount});
        p.save();
        gifted += 1;
    });
    console.log(`Gifted rolls to ${gifted} player${gifted == 1 ? 's' : ''}.`);
  } catch (error) {
    console.error('Error awarding rolls: ', error);
  }
}

module.exports = {assignfreerolls};