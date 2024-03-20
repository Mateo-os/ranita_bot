const { Client, Events } = require('discord.js');
const cron = require('cron');

const config = require('./config/config.js');
const helpers = require('./helpers');
const commands = require("./commands/commands.js");

const {token,prefix} = config;
const client = new Client({ intents: [37633] });

client.once(Events.ClientReady, async readyClient => {
    console.log(`Welcome to Ranita bot v${config.version}`);
    console.log(`Logged in as ${readyClient.user.tag}`);
    // Daily roll increment
    const job = new cron.CronJob('00 19 * * *', () => commands.incrementElement(), timeZone = "utc");
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
        const player = await commands.findplayer(message.author.id, message.guild.id) || await commands.newplayer(message);
        let responses = [];
        let response,user,cards;
        switch (command) {
            case 'test':
                responses.push("TEST");
                break;                
            case 'album':
                [user,cards] = await commands.album(player, message);

                if(!user){
                    responses.push("Ese usuario no esta registrado.");
                    break;
                }
                const selfcheck = user.nombre == player.nombre;
                if (!cards.length) {
                    const response = selfcheck ? "No tienes cartas" : `${user.nombre} no tiene cartas`;        
                    responses.push(response);
                    break;
                }
                response = `Estas son todas ${selfcheck? `tus cartas`:`las cartas de ${user.nombre}`}:\n`
                responses.push(response);
                commands.show(responses,message);
                responses.length = 0;
                await helpers.sendCardEmbed(message,cards,true,true);
                break;
            case 'checkcards':
                [ response, cards] = await commands.checkcards(player, message, args);
                responses.push(response);
                commands.show(responses,message);
                await helpers.sendCardListEmbed(message,cards);
                break;
            case 'checkseries':
                [response, cards] = await commands.checkseries(player, message, args);
                responses.push(response);
                commands.show(responses,message);
                await helpers.sendCardListEmbed(message,cards);
                break;
            case 'giftrolls':
                responses = responses.concat(await commands.giftrolls(player, message, args));
                break;
            case 'give':
                responses = responses.concat(await commands.give(player, message, args));
                break;
            case 'help':
                responses = commands.help(message);
                break;
            case 'info':
                console.log(message.author);
                responses = responses.concat(await commands.info(player));
                break;
            case 'ownerrolls':
                responses = responses.concat(await commands.ownerrolls(message, args));
                break;
            case 'repeats':
                [response, cards] = await commands.repeats(player, message);
                responses.push(response);
                commands.show(responses,message);
                await helpers.sendCardListEmbed(message,cards);
                break;
            case 'roll':
                //Logic that handles the database update and returns the cards that were rolled 
                const rolledcards = await commands.roll(player);
                if (!rolledcards.length) {
                    // Rolls will only return an empty list when the player has 
                    // no rolls
                    responses.push("No tienes rolls");
                    break;
                }
                // Create and send the embeds for the cards
                await helpers.sendCardEmbed(message,rolledcards, false,false,true);
                break;                
            case 'trade':
                responses.push('Trade');
                break;
                commands.trade(player,message,args);
                responses = [];
                break;
        }
        commands.show(responses, message);
    } catch (err) {
        console.log(err);
        /*message.channel.send("¡Hey! <@530487646766497792> y <@441325983363235841> he aquí un error.");
        client.users.cache.get('530487646766497792').send(`Un error en ${message.url}.`); //Ray
        client.users.cache.get('441325983363235841').send(`Un error en ${message.url}.`); //Mateo*/
    }
});

client.login(token);