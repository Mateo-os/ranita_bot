const {ActionRowBuilder, ButtonBuilder, EmbedBuilder, StringSelectMenuBuilder} = require('discord.js');
const urljoin = require('urljoin');
const {albumURL} = require('../config/config.js');
const {rarities} = require('./constants.js');

function pagePanel(totalPages){
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

async function sendEmbedSinglePage(message, pages){
    const msg = await message.channel.send({ embeds: pages });
}

async function sendPaginatedEmbed(message, pages, interactionTime){
    if(pages.length == 0) return;
    let currentPage = 0;
    const buttonPanel = pagePanel(pages.length);     
    const msg = await message.channel.send({ embeds: [pages[currentPage]], components: [buttonPanel] });

    const filter = i => i.customId === 'previous_button' || i.customId === 'next_button';
    //The interaction time is expressed in minutes, convert to miliseconds
    const collector = msg.createMessageComponentCollector({ filter, time: interactionTime*60*1000 });

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

async function sendCardEmbed(message, cards,paginated=false,showRepeats = false,showNew = false,interactionTime = 3){
    const pages = cards.map(c =>{
        const photopath = urljoin(albumURL,`${c.URLimagen}.png`);
        const nw = (showNew && !c.Cromo)  ? '**NEW!!!** ' : '';
        const embed = new EmbedBuilder()
            .setTitle("Informacion de carta")
            .setColor(0x31593B)
            .setImage(photopath)
            .addFields(
                { name: `Carta`, value: `${nw}${c.nombre}`},
                { name: `Serie`, value: `${c.serie}  (${c.numero})`},
                { name: `Rareza`, value: `${c.rareza}  (${rarities[c.rareza]})`},
            );
            // The check for the Cromo object is a sanity check
            if (c.Cromo  && showRepeats){
                embed.addFields(
                    {name: `En posesión`, value:`${c.Cromo.cantidad}`}
                )
            }
        return embed;
    });

    if(paginated)
        sendPaginatedEmbed(message,pages,interactionTime);
    else
        sendEmbedSinglePage(message,pages);

}

async function sendCardListEmbed(message,textList,interactionTime=2){
    if(!textList) return;
    const pages = textList.map(text => {
        const embed = new EmbedBuilder()
            .setTitle('Listado de cartas')
            .setColor(0x31593B)
            .setDescription(text)
        return embed
    });
    sendPaginatedEmbed(message,pages,interactionTime);
}



function confirmationPanel(){
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

function confimDenyPanel(confirmcount){

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
    if (confirmcount > 1){
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


function dropdownPanel(placeholder, options){
    const row = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('dropdown')
                .setPlaceholder(placeholder)
                .setOptions(
                    options.map(option => ({
                        label: option.label,
                        value: option.value,
                    }))
                )
        );

    return row;
}

async function sendCardDropDownEmbed(message,cards,placeholder,minSelect,maxSelect,interactionTime){
    const cardOptions = cards.map( c => ({
        label: `${c.nombre} - ${c.serie}`,
        value: c.id.toString()
    }));
    const dropdown = dropdownPanel(placeholder,cardOptions);

    return message.channel.send({components:[dropdown]});
}

async function sendTradeSelector(message, user_id ,cards, parsedCards,callback,interactionTime = 2){
        
    await sendCardListEmbed(message,parsedCards,interactionTime);
    const msg = await sendCardDropDownEmbed(message,cards,"Elige una carta.",1,1,interactionTime);
    const confirm_button = confirmationPanel();
    const panelmsg = await msg.channel.send({embeds:[],components:[confirm_button]});
    const filter = i => (i.customId === 'confirm_button' || i.customId === 'dropdown') && (i.user.id === user_id);
    //The interaction time is expressed in minutes, convert to miliseconds
    let selectCardID;
    const dropdown_collector = msg.createMessageComponentCollector({ filter, time: interactionTime*60*1000 });
    const button_collector = panelmsg.createMessageComponentCollector({ filter, time: interactionTime*60*100});
    
    
    
    dropdown_collector.on('collect', async interaction => {
        selectCardID = interaction.values[0];
        confirm_button.components[0].setDisabled(false);
        await panelmsg.edit({embeds:[],components:[confirm_button]});
        interaction.deferUpdate();
    });

    dropdown_collector.on('end', async () => {
        await msg.delete();
    });

    button_collector.on('collect', async interaction => {
        confirm_button.components[0].setStyle('Success');
        confirm_button.components[0].setDisabled(true);
        await interaction.update({components:[confirm_button]});
        callback(selectCardID);
    });
    
    button_collector.on('end', async () => {
        await panelmsg.delete();
    });

}

async function sendTradeConfirmator(message, user1_id, user2_id,callback, interactionTime = 2) {
    const confirmed = {
        user1_id: false,
        user2_id: false,
    }
    const confirm_button = confimDenyPanel(2);

    message.channel.send({components:[confirm_button]});
}


module.exports = {pagePanel,sendCardEmbed, sendCardListEmbed, sendTradeSelector, sendTradeConfirmator};