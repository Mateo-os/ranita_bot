const { Client, Events, EmbedBuilder } = require('discord.js');
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
const config = require('./config/config.js');
const token = config.token;
const prefix = config.prefix;
const owner = config.owner;





client.once(Events.ClientReady,async readyClient => {
    console.log(`Welcome to Ranita bot v${config.version}` );
    console.log(`Logged in as ${readyClient.user.tag}`);
    // Daily roll increment
    const job = new cron.CronJob('18 00 * * *', () => incrementElement(),timeZone="utc");
    job.start();
});

client.on('messageCreate', async message => {
    try{
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
                if(message.author.id!=441325983363235841||message.author.id!=530487646766497792)break;
                incrementElement(100);
                const infoE = new EmbedBuilder()
                    .setColor(0x31593B)
                    .setTitle(`Información sobre ${message.author.globalName.toUpperCase()}`)
                    .addFields(
                        { name: 'Rolls: ', value: `${player.rolls}`, inline: true },
                        { name: 'Cromos en el album:', value: `${player.cartas.length}`, inline: true },
                        { name: 'Owner?', value: (message.author.id === owner) ? "Sí" : "No", inline: true },
                    ).setImage('https://www.manimalworld.net/medias/images/alytesmuletensis.jpg');
                message.channel.send({ embeds: [infoE] });
                //responses = responses.push({ embeds: [infoE] }); //No funciona al no ser un string
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
                responses = responses.concat(await repeats(player,message));
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
        message.channel.send("¡Hey! <@530487646766497792> y <@441325983363235841> he aquí un error.");
        client.users.cache.get('530487646766497792').send(`Un error en ${message.url}.`); //Ray
        client.users.cache.get('441325983363235841').send(`Un error en ${message.url}.`); //Mateo
    }
});

client.login(token);