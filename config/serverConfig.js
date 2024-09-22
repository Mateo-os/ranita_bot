const fs = require('fs');

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

        for (const [channel, permissions] of Object.entries(config.CHANNELS)) {
            const { allow, deny } = permissions;
            // Neither allow nor deny can have duplications
            if (new Set(allow).size !== allow.length) {
                throw new Error(`'allow' array for ${channel} contains duplicates in server ${server}`);
            }
            if (new Set(deny).size !== deny.length) {
                throw new Error(`'deny' array for ${channel} contains duplicates in server ${server}`);
            }

            // allow cannot have an element that is present in the BANNED_COMMANDS list
            for (const command of allow) {
                if (command !== '*' && config.BANNED_COMMANDS.includes(command)) {
                    throw new Error(`'allow' array for ${channel} contains a banned command in server ${server}`);
                }
            }

            // If allow (or deny) contains the wildcard, that's the only element it can have
            if (allow.includes('*') && allow.length > 1) {
                throw new Error(`'allow' array for ${channel} in server ${server} contains '*' but has other elements`);
            }
            if (deny.includes('*') && deny.length > 1) {
                throw new Error(`'deny' array for ${channel} in server ${server} contains '*' but has other elements`);
            }

            // d. If allow is ['*'], deny can't be ['*']
            if (allow.length === 1 && allow[0] === '*' && deny.length === 1 && deny[0] === '*') {
                throw new Error(`'allow' array for ${channel} in server ${server} is ['*'] but 'deny' array is also ['*']`);
            }

            // e. If allow contains a non-'*' element, "deny" must be either empty or contain a wildcard
            if (allow.length > 0 && !allow.includes('*')) {
                if (deny.length > 0 && !deny.includes('*')) {
                    throw new Error(`'allow' array for ${channel} in server ${server} contains non-'*' elements but 'deny' array does not contain '*'`);
                }
            }
        }

        // Validate DEFAULT
        const { allow: defaultAllow, deny: defaultDeny } = config.DEFAULT;
        if (new Set(defaultAllow).size !== defaultAllow.length) {
            throw new Error(`DEFAULT allow array in server ${server} contains duplicates`);
        }
        if (new Set(defaultDeny).size !== defaultDeny.length) {
            throw new Error(`DEFAULT deny array in server ${server} contains duplicates`);
        }
        if (defaultAllow.includes('*') && defaultAllow.length > 1) {
            throw new Error(`DEFAULT allow array in server ${server} contains '*' but has other elements`);
        }
        if (defaultDeny.includes('*') && defaultDeny.length > 1) {
            throw new Error(`DEFAULT deny array in server ${server} contains '*' but has other elements`);
        }

        if (defaultAllow.length === 1 && defaultAllow[0] === '*' && defaultDeny.length === 1 && defaultDeny[0] === '*') {
            throw new Error(`DEFAULT 'allow' array in server ${server} is ['*'] but 'deny' array is also ['*']`);
        }

        if (defaultAllow.length > 0 && !defaultAllow.includes('*')) {
            if (defaultDeny.length > 0 && !defaultDeny.includes('*')) {
                throw new Error(`DEFAULT 'allow' array in server ${server} contains non-'*' elements but 'deny' array does not contain '*'`);
            }
        }
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
