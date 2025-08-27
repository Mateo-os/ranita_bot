const { config } = require('../config/config');

const globalServerConfig = config.serverConfig || {};

function validateCommand(server_id, channel, command) {
    const emptyResponse = []
    if (!(server_id in globalServerConfig)){
        // Allow by default if no specific config exists for the server
        return [true, emptyResponse];  
    }
    const serverConfig = globalServerConfig[server_id];
    const prefix = serverConfig.PREFIX
    // Check if the command is banned globally
    if (serverConfig.BANNED_COMMANDS.includes(command)) {
        return [false, [`El comando ${prefix}${command} está prohibido en el servidor.`]];
    }

    // Fetch the channel config. If it not exist, use the default 
    const channelConfig = channel in serverConfig.CHANNELS ? serverConfig.CHANNELS[channel] : serverConfig.DEFAULT;
    const forbidenCommandResponse = [`El comando ${prefix}${command} no existe o está deshabilitado en este canal.`] 
    
    // First check for explicit allowance
    if (channelConfig.allow.includes(command)){
        return [true,emptyResponse]
    }

    // If no explicit allow, then check for explicit or global deny
    if (channelConfig.deny.includes('*') || channelConfig.deny.includes(command)) {
        return [false, forbidenCommandResponse];
    }

    // Check general allow either with wildcard or empty list 
    if (channelConfig.allow.includes('*') || channelConfig.allow.length === 0) {
        return [true, emptyResponse];
    }

    // Deny if no rules are matched.
    // Pre-validation garantuees "*"" can't exists in both deny and allow.
    return [false, forbidenCommandResponse]    
}

module.exports = {
    validateCommand,
};
