const fs = require('fs');


function validatePermissions(allow, deny, banned, channelName, serverName){
        // Neither allow nor deny can have duplications
        if (new Set(allow).size !== allow.length) {
            throw new Error(`'allow' array for ${channelName} contains duplicates in server ${serverName}`);
        }
        if (new Set(deny).size !== deny.length) {
            throw new Error(`'deny' array for ${channelName} contains duplicates in server ${serverName}`);
        }
        // Allow cannot have an element that is present in the BANNED_COMMANDS list
        for (const command of allow) {
            if (command !== '*' && banned.includes(command)) {
                throw new Error(`'allow' array for ${channelName} contains a banned command in server ${serverName}`);
            }
        }
        // If allow (or deny) contains the wildcard, that's the only element it can have
        if (allow.includes('*') && allow.length > 1) {
            throw new Error(`'allow' array for ${channelName} in server ${serverName} contains '*' but has other elements`);
        }
        if (deny.includes('*') && deny.length > 1) {
            throw new Error(`'deny' array for ${channelName} in server ${serverName} contains '*' but has other elements`);
        }
        // If allow is ['*'], deny can't be ['*']
        if (allow.length === 1 && allow[0] === '*' && deny.length === 1 && deny[0] === '*') {
            throw new Error(`'allow' array for ${channelName} in server ${serverName} is ['*'] but 'deny' array is also ['*']`);
        }
        // If allow contains a non-'*' element, "deny" must be either empty or contain a wildcard
        if (allow.length > 0 && !allow.includes('*')) {
            if (deny.length > 0 && !deny.includes('*')) {
                throw new Error(`'allow' array for ${channelName} in server ${serverName} contains non-'*' elements but 'deny' array does not contain '*'`);
            }
        }
}


function validateConfig(cfg) {
    for(const [server, config] of Object.entries(cfg)){
        
        // Ensure BANNED_COMMANDS, CHANNELS, and DEFAULT keys exist
        config.BANNED_COMMANDS = config.BANNED_COMMANDS || [];
        config.CHANNELS = config.CHANNELS || {};
        config.DEFAULT =  config.DEFAULT || { allow: [], deny: ["*"] };
        config.OWNER = config.OWNER || 0;
        config.PREFIX = config.PREFIX || '/';
        config.ALBUMURL = config.ALBUMURL || 'https://i.imgur.com/';


        const bannedCommandsSet = new Set(config.BANNED_COMMANDS);
        if (bannedCommandsSet.size !== config.BANNED_COMMANDS.length) {
            throw new Error('BANNED_COMMANDS contains duplicates');
        }

        const banned = config.BANNED_COMMANDS;
        for (const [channel, permissions] of Object.entries(config.CHANNELS)) {
            const { allow, deny,name} = permissions;
            validatePermissions(allow,deny,banned,name,server)
        }

        // Validate DEFAULT
        const { allow: defaultAllow, deny: defaultDeny } = config.DEFAULT;
        validatePermissions(defaultAllow,defaultDeny,banned,"DEFAULT", server)
    }
}

let serverConfig = {};
try {
    const data = fs.readFileSync('./config/serverData.json', 'utf8');
    serverConfig = JSON.parse(data);
} catch (err) {
    console.error('Error reading or validating channel configuration:', err.message);
}

validateConfig(serverConfig);

module.exports = serverConfig;
