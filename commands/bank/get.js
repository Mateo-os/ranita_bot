const { config} = require('../../config/config');
const { findplayer } = require('../findplayer');

async function get(server_id){
    const bank = await findplayer(config.botID(), server_id,true);
    return bank;
}