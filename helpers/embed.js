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
        );

    return row;
}


async function sendCardEmbed(message, cards,showRepeats = false){
    const pages = cards.map(c =>{
        const photopath = urljoin(albumURL,`${c.URLimagen}.png`);
        const embed = new EmbedBuilder()
            .setTitle("Informacion de carta")
            .setColor(0x31593B)
            .setImage(photopath)
            .addFields(
                { name: `Carta`, value: c.nombre},
                { name: `Serie`, value: `${c.serie}  (${c.numero})`},
                { name: `Rareza`, value: `${c.rareza}  (${rarities[c.rareza]})`},
            );
            if (c.Cromo  && showRepeats){
                embed.addFields(
                    {name: `En posesión`, value:`${c.Cromo.cantidad}`}
                )
            }
        return embed;
    });

    let currentPage = 0;
    const buttonPanel = newPanel(pages.length);     
    const msg = await message.channel.send({ embeds: [pages[currentPage]], components: [buttonPanel] });

    const filter = i => i.customId === 'previous_button' || i.customId === 'next_button';
    const collector = msg.createMessageComponentCollector({ filter, time: 60000 });

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

module.exports = {newPanel,sendCardEmbed};