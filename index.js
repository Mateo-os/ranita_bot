const { Client, Events } = require('discord.js');
const cron = require('cron');

const { config, setBotID } = require('./config/config.js');
const helpers = require('./helpers');
const commands = require("./commands");

const { token, prefix } = config;
const client = new Client({ intents: [37633] });

async function startbanks(){
    const servers = await commands.server.retrieve();
    servers.forEach( async server_id => {
        const id = config.botID();
        (await commands.findplayer(id, server_id,true)) || (await commands.createplayer('',id,server_id));         
    })
}


client.once(Events.ClientReady, async readyClient => {
    console.log(`Welcome to Ranita bot v${config.version}`);
    console.log(`Logged in as ${readyClient.user.tag}`);
    setBotID(readyClient.user.id);
    const servers = await commands.server.retrieve();
    await startbanks();
    // Daily roll increment
    const job = new cron.CronJob('00 19 * * *', () => commands.rolls.assignfreerolls(), timeZone = "utc");
    job.start();
});

client.on('messageCreate', async message => {
    try {
        //Ignore bots and message without the prefix
        if (!message.content.startsWith(prefix) || message.author.bot)
            return;
        //Retreive all words separated by one or more spaces as arguments
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();
        const player = await commands.findplayer(message.author.id, message.guild.id) || await commands.newplayer(message);
        let responses = [];
        let response, user, cards,selfcheck,player2,bank,rolledcards;
        switch (command) {
            case 'album':
                [user, cards] = await commands.info.album(player, message);
                
                if (!user) {
                    responses.push("Ese usuario no esta registrado.");
                    break;
                }
                selfcheck = user.nombre == player.nombre;
                if (!cards.length) {
                    const response = selfcheck ? "No tienes cartas" : `${user.nombre} no tiene cartas`;
                    responses.push(response);
                    break;
                }
                response = `Estas son todas ${selfcheck ? `tus cartas` : `las cartas de ${user.nombre}`}:\n`
                responses.push(response);
                await commands.show(responses, message);
                responses.length = 0;
                await helpers.sendCardEmbed(message, cards, true, true);
                break;
            case 'award':
                responses = responses.concat(await commands.owner.award(message, args));
                break;
            case 'awardcoins':
                responses = responses.concat(await commands.owner.awardcoins(message, args));
                break;
            case 'buy':
                bank = await commands.bank.get(message.guild.id);
                if (!bank) {
                    responses.push("Ocurrió un error en el banco. No esta inicializado.");
                    break;
                }
                [response, cards, parsedCards] = await commands.bank.buy.prebuy(bank,player,message,args);
                responses.push(response);
                await commands.show(responses, message);
                async function buycallback(card_id,response=true){
                    callbackresponses = await commands.bank.buy.buy(player,bank,card_id,response)
                    await commands.show(callbackresponses, message);
                    return
                }
                if(cards && cards.length > 1){
                    await helpers.sendCardSelector(message,message.author.id,cards,parsedCards,buycallback)
                }else if(cards.length == 1){
                    await buycallback(cards[0].id,false)
                }
                break;
            case 'buyrolls':
                responses = responses.concat(await commands.bank.buyrolls(player,message, args));
                break;
            case 'checkcards':
                [response, cards] = await commands.info.checkcards(player, message, args);
                responses.push(response);
                await commands.show(responses, message);
                await helpers.sendCardListEmbed(message, cards);
                break;
            case 'checkseries':
                [response, cards] = await commands.info.checkseries(player, message, args);
                responses.push(response);
                await commands.show(responses, message);
                await helpers.sendCardListEmbed(message, cards);
                break;
            case 'gift':
                [response, cards, parsedCards, player2] = await commands.cards.gift.pregift(player,message,args)
                responses.push(response);
                await commands.show(responses, message);
                async function giftcallback(card_id,response=true){
                    callbackresponses = await commands.cards.gift.gift(player,player2,card_id,response)
                    await commands.show(callbackresponses, message);
                    return
                }
                if(cards && cards.length > 1){
                    await helpers.sendCardSelector(message,message.author.id,cards,parsedCards,giftcallback)
                }else if(cards.length == 1){
                    await giftcallback(cards[0].id,false)
                }
                break;
            case 'giftcoins':
                responses = responses.concat(await commands.bank.giftcoins(player,message,args))
                break;
            case 'giftrolls':
                responses = responses.concat(await commands.rolls.giftrolls(player, message, args));
                break;
            case 'give':
                responses = responses.concat(await commands.owner.give(player, message, args));
                break;
            case 'help':
                responses = commands.help(message);
                break;
            case 'info':
                console.log(message.author);
                responses = responses.concat(await commands.info.info(player));
                break;
            case 'recycle':
                responses = responses.concat(await commands.cards.recycle(player, args));
                break;
            case 'repeats':
                [response, cards] = await commands.info.repeats(player, message);
                responses.push(response);
                await commands.show(responses, message);
                await helpers.sendCardListEmbed(message, cards);
                break;
            case 'roll':
                //Logic that handles the database update and returns the cards that were rolled
                [response,rolledcards] = await commands.rolls.roll(player,args);
                responses.push(response);
                await commands.show(responses, message);
                if(rolledcards.length){
                    const step = 3*helpers.CARDS_PER_ROLL
                    for(let i = 0; i < rolledcards.length; i += step){
                        await helpers.sendCardEmbed(message, rolledcards.slice(i,i + step), false, false, true);
                    }
                }
                break;
            case 'scrap':
                responses = responses.concat(await commands.cards.scrap(player, args));
                break;
            case 'sell':
                bank = await commands.bank.get(message.guild.id);
                if (!bank) {
                    responses.push("Ocurrió un error en el banco. No esta inicializado.");
                    break;
                }
                [response, cards, parsedCards] = await commands.bank.sell.presell(player,message,args);
                responses.push(response);
                await commands.show(responses, message);
                async function sellcallback(card_id,response=true){
                    callbackresponses = await commands.bank.sell.sell(player,bank,card_id,response)
                    await commands.show(callbackresponses, message);
                    return
                }
                if(cards && cards.length > 1){
                    await helpers.sendCardSelector(message,message.author.id,cards,parsedCards,sellcallback)
                }else if(cards.length == 1){
                    await sellcallback(cards[0].id,false)
                }
                break;
            case 'shop':
                [response, cards] = await commands.bank.shop(message);
                responses.push(response);
                await commands.show(responses, message);
                await helpers.sendCardListEmbed(message, cards);
                break;
            case 'stock':
                responses = responses.concat(await commands.owner.stock(player, message, args));
                break;
            case 'take':
                responses = responses.concat(await commands.owner.take(player, message, args));
                break;
            case 'textalbum':
                [user, cards] = await commands.info.album(player, message);
                
                if (!user) {
                    responses.push("Ese usuario no esta registrado.");
                    break;
                }
                selfcheck = user.nombre == player.nombre;
                if (!cards.length) {
                    const response = selfcheck ? "No tienes cartas" : `${user.nombre} no tiene cartas`;
                    responses.push(response);
                    break;
                }
                response = `Estas son todas ${selfcheck ? `tus cartas` : `las cartas de ${user.nombre}`}:\n`
                responses.push(response);
                await commands.show(responses, message);
                responses.length = 0;
                await helpers.sendCardListEmbed(message, helpers.parseCartas(cards,true));
                break;
            case 'trade':
                let player1cards, player2cards, card1, card2;
                [response, player1cards, parsedCards, player2] = await commands.trade.pretrade(player, message, args);
                responses.push(response);
                await commands.show(responses, message, true);

                async function preTradecallback(cardID) {
                    card1 = player1cards.find(c => c.id == cardID);
                    await helpers.sendTradeRequest(message, player2.id_discord, tradeRequestcallback, emergencyExitCallback);
                }

                async function tradeRequestcallback(card2name) {
                    [response, player2cards, parsedCards] = await commands.trade.asktrade(player2, card1, card2name);
                    const callbackresponses = [response];
                    await commands.show(callbackresponses, message);
                    if (player2cards && player2cards.length > 1)
                        await helpers.sendCardSelector(message, player2.id_discord, player2cards, parsedCards, askTradecallback, emergencyExitCallback);
                    else if (player2cards.length == 1)
                        await askTradecallback(player2cards[0].id);
                }

                async function askTradecallback(cardID) {
                    card2 = player2cards.find(c => c.id == cardID);
                    await helpers.sendTradeConfirmator(message, player.id_discord, card1, player2.id_discord, card2, completeTradeCallback, emergencyExitCallback);
                }
                async function completeTradeCallback() {
                    const callbackresponses = [];
                    callbackresponses.push(await commands.trade.trade(player, card1, player2, card2));
                    await commands.show(callbackresponses, message);
                }

                async function emergencyExitCallback(exit_message){
                    const callbackResponses = [exit_message];
                    await commands.show(callbackResponses, message);
                }

                if (player1cards && player1cards.length > 1)
                    await helpers.sendCardSelector(message, message.author.id, player1cards, parsedCards, preTradecallback, emergencyExitCallback);
                else if (player1cards.length == 1)
                    await preTradecallback(player1cards[0].id);
                break;
        }
        await commands.show(responses, message);
    } catch (err) {
        console.log(err);
        /*message.channel.send("¡Hey! <@530487646766497792> y <@441325983363235841> he aquí un error.");
        client.users.cache.get('530487646766497792').send(`Un error en ${message.url}.`); //Ray
        client.users.cache.get('441325983363235841').send(`Un error en ${message.url}.`); //Mateo*/
    }
});

client.login(token);