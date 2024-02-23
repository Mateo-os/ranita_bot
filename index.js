const { Client, Events,EmbedBuilder } = require('discord.js');
const cron = require('cron');
const client = new Client({ intents: [37633] });
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
const {newPanel, startCollector} = require('./helpers');
const config = require('./config/config.js');
const token = config.token;
const prefix = config.prefix;
const owner = config.owner;


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
                // devs only
                if (author_id != BigInt("441325983363235841") && author_id != BigInt("530487646766497792")) break;
                const pages = [];
                for (let i = 0; i < 4; i++) {
                    const embed = new EmbedBuilder()
                        .setColor(0x31593B)
                        .setDescription(`Pagina ${i + 1}`);
        
                    pages.push(embed);
                }
        
                const buttonPanel = newPanel();
                let currentPage = 0;         
                const msg = await message.channel.send({ embeds: [pages[currentPage]], components: [buttonPanel] });
        
                const filter = i => i.customId === 'previous_button' || i.customId === 'next_button';
                // Active for 2 minutes 
                const collector = msg.createMessageComponentCollector({ filter, time: 120000 });
                startCollector(msg,collector,currentPage,pages,buttonPanel);
                break;
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
                responses = responses.concat(await roll(player));
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