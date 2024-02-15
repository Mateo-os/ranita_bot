const { EmbedBuilder } = require('discord.js');

async function help(message){
    const infoE = new EmbedBuilder()
        .setColor(0x31593B)
        .setTitle(`Información sobre el bot`)
        .addFields(
            { name: '/roll ', value: `Cada tirada son 5 personajes. Se consiguen mas tiradas diariamente (1 cada 24 horas) y según <@273266775481778177> vaya liberando.`, inline: false },
            { name: '/album', value: `Muestra todos los personajes que tienes.`, inline: false },
            { name: '/giftrolls', value: "Ponés un número, mencionás a un usuario y le regalás las rolls indicadas.", inline: false },
            { name: '/info', value: "Te da tu data", inline: false },
            { name: '/checkcards', value: "Comprobás si tenés el personaje que escribís", inline: false },
            { name: 'Cuestiones tecnicas', value: "Contacte <@530487646766497792> o <@441325983363235841>", inline: false },
        ).setImage('https://www.manimalworld.net/medias/images/alytesmuletensis.jpg');
    message.channel.send({ embeds: [infoE] });
}


module.exports = help;