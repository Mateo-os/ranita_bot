const {ActionRowBuilder, ButtonBuilder} = require('discord.js');

function newPanel(){
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('previous_button')
                .setEmoji('⏪')
                .setStyle('Primary')
                .setDisabled(true),
            new ButtonBuilder()
                .setCustomId('next_button')
                .setEmoji('⏩')
                .setStyle('Primary')
        );

    return row;
}


function startCollector(msg, collector, startingPage, embeds, component){
    collector.on('collect', async interaction => {
        let newpage;
        if (interaction.customId === 'previous_button') {
            newpage = Math.max(0, startingPage - 1);
        } else if (interaction.customId === 'next_button') {
            newpage = Math.min(embeds.length - 1, startingPage + 1);
        }

        // Update button states based on current page index
        component.components[0].setDisabled(newpage === 0); // Disable "previous" button on page 0
        component.components[1].setDisabled(newpage === embeds.length - 1); // Disable "next" button on last page

        await interaction.update({ embeds: [embeds[newpage]], components: [component] });
    });

    collector.on('end', async () => {
        await msg.edit({ components: [] });
    });
}

module.exports = {newPanel,startCollector};