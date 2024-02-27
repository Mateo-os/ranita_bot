const { Client, Events,EmbedBuilder, AttachmentBuilder} = require('discord.js');
const cron = require('cron');
const client = new Client({ intents: [37633] });
const urljoin = require('urljoin');
const {
    incrementElement,
    roll,
    show,
    album,
    info,
    ownerrolls,
    giftrolls,
    newplayer,
    findplayer,
    checkcards,
    repeats,
    help
} = require("./commands/commands.js");
const {models} = require("./database.js");
const { newPanel, rarities, sendCardEmbed} = require('./helpers');
const config = require('./config/config.js');
const {token,prefix,albumURL} = config;

client.once(Events.ClientReady, async readyClient => {
    console.log(`Welcome to Ranita bot v${config.version}`);
    console.log(`Logged in as ${readyClient.user.tag}`);
    // Daily roll increment
    const job = new cron.CronJob('00 19 * * *', () => incrementElement(), timeZone = "utc");
    job.start();
});

client.on('messageCreate', async message => {
    try {
        //Ignore bots and message without the prefix
        if (!message.content.startsWith(prefix) || message.author.bot)
            return;
        //Retreive all words separated by on or more spaces as arguments
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();
        let player = await findplayer(message.author.id, message.guild.id) || await newplayer(message);
        let responses = [];
        switch (command) {
            case 'test':                
                const author_id = BigInt(message.author.id);
                const cartas = await models.Carta.findAll({"where":{"serie":"20th Century Boys"},"limit":4});
                const rarezas={
                    1:'COMÚN',
                    2:'POCO COMÚN',
                    3:'RARA',
                    4:'ÉPICA',
                    5:'LEGENDARIA'
                }
            case 'album':
                responses = responses.concat(await album(player, message));
                break;
            case 'checkcards':
                responses = responses.concat(await checkcards(player, message, args));
                break;
            case 'giftrolls':
                responses = responses.concat(await giftrolls(player, message, args));
                break;
            case 'help':
                responses = help(message);
                break;
            case 'info':
                console.log(message.author);
                responses = responses.concat(await info(player));
                break;
            case 'ownerrolls':
                responses = responses.concat(await ownerrolls(message, args));
                break;
            case 'repeats':
                responses = responses.concat(await repeats(player, message));
                break;
            case 'roll':
                //Logic that handles the database update and returns the cards that were rolled 
                cards = await roll(player);
                if (!cards.length) {
                    // Rolls will only return an empty list when the player has 
                    // no rolls
                    responses.push("No tienes rolls");
                    break;
                }
                // Create and send the embeds for the cards
                await sendCardEmbed(message,cards);
                break;                
            case 'trade':
                responses = responses.concat("Pato");
                break;
        }
        show(responses, message);
    } catch (err) {
        console.log(err);
        /*message.channel.send("¡Hey! <@530487646766497792> y <@441325983363235841> he aquí un error.");
        client.users.cache.get('530487646766497792').send(`Un error en ${message.url}.`); //Ray
        client.users.cache.get('441325983363235841').send(`Un error en ${message.url}.`); //Mateo*/
    }
});

client.login(token);