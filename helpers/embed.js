const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, StringSelectMenuBuilder } = require('discord.js');
const urljoin = require('urljoin');
const { config} = require('../config/config.js');
const { rarities } = require('./constants.js');
const mutex = require('./async.js');

//const albumURL = config.albumURL;
function pagePanel(totalPages) {
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('previous_button')
                .setEmoji('⏪')
                .setStyle('Primary')
                .setDisabled(true),
            new ButtonBuilder()
                .setCustomId('page_button')
                .setLabel(`1/${totalPages}`)
                .setStyle('Secondary')
                .setDisabled(true),
            new ButtonBuilder()
                .setCustomId('next_button')
                .setEmoji('⏩')
                .setStyle('Primary')
                .setDisabled(totalPages == 1)
        );

    return row;
}

function confirmationPanel() {
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('confirm_button')
                .setEmoji('✅')
                .setStyle('Secondary')
        );


    return row;
}

async function sendEmbedSinglePage(message, pages) {
    const msg = await message.channel.send({ embeds: pages });
}

async function sendPaginatedEmbed(message, pages, interactionTime) {
    if (pages.length == 0) return;
    let currentPage = 0;
    const buttonPanel = pagePanel(pages.length);
    const msg = await message.channel.send({ embeds: [pages[currentPage]], components: [buttonPanel] });

    const filter = i => i.customId === 'previous_button' || i.customId === 'next_button';
    //The interaction time is expressed in minutes, convert to miliseconds
    const collector = msg.createMessageComponentCollector({ filter, time: interactionTime * 60 * 1000 });

    collector.on('collect', async interaction => {
        if (interaction.customId === 'previous_button') {
            currentPage = Math.max(0, currentPage - 1);
        } else if (interaction.customId === 'next_button') {
            currentPage = Math.min(pages.length - 1, currentPage + 1);
        }

        // Update button states based on current page index
        buttonPanel.components[0].setDisabled(currentPage === 0); // Disable "previous" button on page 0
        buttonPanel.components[1].setLabel(`${currentPage + 1}/${pages.length}`);
        buttonPanel.components[2].setDisabled(currentPage === pages.length - 1); // Disable "next" button on last page

        await interaction.update({ embeds: [pages[currentPage]], components: [buttonPanel] });
    });

    collector.on('end', async () => {
        await msg.edit({ components: [] });
    });

}

async function sendCardEmbed(message, cards, paginated = false, showRepeats = false, showNew = false, interactionTime = 3) {
    const albumURL = config.serverConfig[message.guild.id].ALBUMURL
    const pages = cards.map(c => {
        const photopath = urljoin(albumURL, `${c.URLimagen}.png`);
        const nw = (showNew && !c.Cromo) ? '**NEW!!!** ' : '';
        const embed = new EmbedBuilder()
            .setTitle("Informacion de carta")
            .setColor(0x31593B)
            .setImage(photopath)
            .addFields(
                { name: `Carta`, value: `${nw}${c.nombre}` },
                { name: `Serie`, value: `${c.serie}  (${c.numero})` },
                { name: `Rareza`, value: `${c.rareza}  (${rarities[c.rareza]})` },
            );
        // The check for the Cromo object is a sanity check
        if (c.Cromo && showRepeats) {
            embed.addFields(
                { name: `En posesión`, value: `${c.Cromo.cantidad}` }
            )
        }
        return embed;
    });

    if (paginated)
        sendPaginatedEmbed(message, pages, interactionTime);
    else
        sendEmbedSinglePage(message, pages);

}

async function sendCardListEmbed(message, textList, interactionTime = 2) {
    if (!textList) return;
    const pages = textList.map(text => {
        const embed = new EmbedBuilder()
            .setTitle('Listado de cartas')
            .setColor(0x31593B)
            .setDescription(text)
        return embed
    });
    sendPaginatedEmbed(message, pages, interactionTime);
}



function confirmationPanel() {
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('confirm_button')
                .setEmoji('✅')
                .setStyle('Secondary')
                .setDisabled(true)
        );
    return row;
}

function confimDenyPanel(confirmcount) {
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('confirm_button')
                .setEmoji('✅')
                .setStyle('Primary'),
            new ButtonBuilder()
                .setCustomId('deny_button')
                .setEmoji('🚫')
                .setStyle('Primary')
        );
    if (confirmcount > 1) {
        row.addComponents(
            new ButtonBuilder()
                .setCustomId('confirm_counter')
                .setLabel(`0/${confirmcount}`)
                .setStyle('Secondary')
                .setDisabled(true)
        );
    }
    return row;
}


function dropdownPanel(placeholder, options,disabled=false) {
    const row = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('dropdown')
                .setPlaceholder(placeholder)
                .setDisabled(disabled)
                .setOptions(options)
        );
    return row;
}

function cardDropdown(cards,placeholder,disabled = false){
    const cardOptions = cards.map(c => ({
        label: `${c.nombre} - ${c.serie}`,
        value: c.id.toString()
    }));
    
    const labels = cardOptions.reduce((acc, option) => {
        acc[option.value] = option.label;
        return acc;
    }, {});

    const dropdown = dropdownPanel(placeholder, cardOptions,disabled);
    return [dropdown,labels];
}

async function sendCardDropDownEmbed(message, cards, placeholder) {

    const [dropdown,labels] = cardDropdown(cards,placeholder);
    const msg = await message.channel.send({ components: [dropdown] })

    return [msg,labels]
}

async function sendCardSelector(message, user_id, cards, parsedCards, callback, emergency_callback, interactionTime = 5) {

    await sendCardListEmbed(message, parsedCards, interactionTime);
    //The interaction time is expressed in minutes, convert to miliseconds
    const expiration_time = interactionTime * 60 * 1000
    const [msg,labels] = await sendCardDropDownEmbed(message, cards, "Elige una carta.");
    const confirm_button = confirmationPanel();
    const panelmsg = await msg.channel.send({ embeds: [], components: [confirm_button] });
    const filter = i => (i.customId === 'confirm_button' || i.customId === 'dropdown') && (i.user.id === user_id);
    const dropdown_collector = msg.createMessageComponentCollector({ filter, time: expiration_time  });
    const button_collector = panelmsg.createMessageComponentCollector({ filter, time: expiration_time });
    
    let good_exit = false;
    
    let selectCardID = "";
    dropdown_collector.on('collect', async interaction => {
        selectCardID = interaction.values[0];
        confirm_button.components[0].setDisabled(false);
        await panelmsg.edit({ embeds: [], components: [confirm_button] });
        interaction.deferUpdate();
    });

    dropdown_collector.on('end', async () => {
        const placeholder = selectCardID != "" ? labels[selectCardID] : "Elige una carta."
        const disabledDropdown = cardDropdown(cards,placeholder, true)[0];
        await msg.edit({ components: [disabledDropdown] });
    });

    button_collector.on('collect', async interaction => {
        confirm_button.components[0].setStyle('Success');
        confirm_button.components[0].setDisabled(true);
        await interaction.update({ components: [confirm_button] });
        good_exit = true;
        button_collector.stop();
        dropdown_collector.stop();
        callback(selectCardID);
    });

    button_collector.on('end', async () => {
        if(!good_exit){
            confirm_button.components[0].setDisabled(true);
            await panelmsg.edit({ components: [confirm_button] });
            emergency_callback("Se canceló el intercambio por falta de respuesta.")
        }      
    });
}

async function sendTradeRequest(message, requested_player_id, callback, emergency_callback ,interactionTime = 5) {
    const msg = message.channel.send(`Hola <@${requested_player_id}>, escribe el nombre de la carta que quieres intercambiar.`)
    const filter = m => m.author.id === requested_player_id;
    const collector = message.channel.createMessageCollector({ filter, max: 1, time: interactionTime  * 60 * 1000 });
    let good_exit = false
    collector.on('collect', collectedMessage => {
        cardName = collectedMessage.content.trim();
        good_exit = true;
        collector.stop();
        callback(cardName);
    });
    collector.on('end', () => {
        if (!good_exit) {
            emergency_callback("Se canceló el intercambio por falta de respuesta.");
        }
    });
}


async function sendTradeConfirmator(message, user1_id, card1, user2_id, card2, callback, emergency_callback ,interactionTime = 5) {
    const confirmed = {}
    confirmed[user1_id] = false;
    confirmed[user2_id] = false;
    let called = false;
    let lock = false;
    const participants = [user1_id, user2_id]
    const confirm_button = confimDenyPanel(2);

    const msgbody = `Se va a intercambiar ${card1.nombre} por ${card2.nombre}. Confirmar: `
    const confirm_msg = await message.channel.send({
        content: msgbody,
        components: [confirm_button]
    });

    const filter = i => (i.customId === 'confirm_button' || i.customId === 'deny_button') && (participants.includes(i.user.id));
    const collector = confirm_msg.createMessageComponentCollector({ filter, time: interactionTime * 60 * 1000 })

    let confirm_count = 0,good_exit = false;
    collector.on('collect', async interaction => {
        if (interaction.customId === 'confirm_button' && !confirmed[interaction.user.id]) {
            confirmed[interaction.user.id] = true;
        } else if (interaction.customId === 'deny_button') {
            good_exit = true;
            confirm_button.components[0].setDisabled(true);
            confirm_button.components[1].setDisabled(true);
            await confirm_msg.edit({
                content: msgbody,
                components: [confirm_button]
            }); 
            collector.stop();
            emergency_callback(`<@${interaction.user.id}> canceló el intercambio.`)
            return;
        }
        
        let count = 0; 
        for(let usr_id in confirmed){
            if (confirmed[usr_id]) {
                count++;
            }
        }
        confirm_count = count;
        
        confirm_button.components[2].setLabel(`${confirm_count}/2`);
        await confirm_msg.edit({
            content: msgbody,
            components: [confirm_button]
        });
        interaction.deferUpdate();
        lock = mutex.lock(lock);
        if (!called && confirm_count == 2) {
            called = true;
            confirm_button.components[0].setDisabled(true);
            confirm_button.components[1].setDisabled(true);
            await confirm_msg.edit({
                content: msgbody,
                components: [confirm_button]
            });                
            lock = mutex.unlock(lock);
            good_exit = true;
            collector.stop();
            callback();
            return;
        } 
        lock = mutex.unlock(lock);
    });
    collector.on('end',async () => {
        if (!good_exit) {
            confirm_button.components[0].setDisabled(true);
            confirm_button.components[1].setDisabled(true);
            await confirm_msg.edit({
                content: msgbody,
                components: [confirm_button]
            }); 
            emergency_callback("Se canceló el intercambio por falta de respuesta.");
        }
    });
}


module.exports = { pagePanel, sendCardEmbed, sendCardListEmbed, sendCardSelector, sendTradeRequest, sendTradeConfirmator, sendPaginatedEmbed};
