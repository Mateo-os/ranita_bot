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

module.exports = {newPanel};