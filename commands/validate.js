const { config } = require('../config/config');

const globalServerConfig = config.serverConfig || {};

function validateCommand(server_id, channel, command) {
    if (!(server_id in globalServerConfig)){
        return [true, []];  // Allow by default if no specific config exists for the server
    }
    let enable = true;
    const response = [];
    const serverConfig = globalServerConfig[server_id];
    const prefix = serverConfig.PREFIX
    // Check if the command is banned globally
    if (serverConfig.BANNED_COMMANDS.includes(command)) {
        enable = false;
        response.push(`El comando ${prefix}${command} está prohibido en el servidor.`);
        return [enable, response];
    }

    // Fetch the channel config. If it not exist, use the default 
    const channelConfig = channel in serverConfig.CHANNELS ? serverConfig.CHANNELS[channel] : serverConfig.DEFAULT;
    // First check for explicit allowance
    if (channelConfig.allow.includes(command)){
        enable = true
        return [enable,response]
    }
    // Check that the command isn't denied in any way
    // Check for general exclusion, 
    // Then check for explicit exclusion, otherwise
    // Otherwhise check for absence of general inclusion
    // (channelConfig.allow.includes('*') || channelConfig.allow.length === 0) means that every command is allowed. 
    if( channelConfig.deny.includes('*')     || 
        channelConfig.deny.includes(command) || 
        (!(channelConfig.allow.includes('*') || channelConfig.allow.length === 0))
    ) {
        enable = false;
        response.push(`El comando ${prefix}${command} no existe o está deshabilitado en este canal.`);
    }

    return [enable, response];
}

module.exports = {
    validateCommand,
};
