const {ActionRowBuilder, ButtonBuilder, EmbedBuilder} = require('discord.js');
const urljoin = require('urljoin');
const {albumURL} = require('../config/config.js');
const {rarities} = require('./constants.js');

function newPanel(totalPages){
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
    const buttonPanel = newPanel(pages.length);     
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

async function sendCardEmbed(message, cards,paginated=false,showRepeats = false,interactionTime = 3){
    const pages = cards.map(c =>{
        const photopath = urljoin(albumURL,`${c.URLimagen}.png`);
        const nw = c.Cromo.cantidad == 1 ? 'NEW! ' : '';
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

module.exports = {newPanel,sendCardEmbed, sendCardListEmbed};