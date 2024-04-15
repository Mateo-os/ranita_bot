const helpers = require('../../helpers');

function parse(query){
    let response = "\`\`\`"
    response += "Personaje:".padEnd(26) + "Precio:".padEnd(12) + "Serie:\n"
    query.forEach( elem => {
        const repeat = (elem.Cromo && elem.Cromo.cantidad > 1) ? `[+${elem.Cromo.cantidad - 1}]` : '';
        const name = `${elem.nombre.length <= 21 ? elem.nombre : elem.nombre.slice(0,17) + '...'}`;
        const price = `${helpers.buy_price[elem.rareza]}`; 
        const series = `${elem.serie}  (${elem.numero})`;
        response += `${repeat.padEnd(6)}${name.padEnd(25)}${price.padEnd(9)}${series}\n`;
    });
    response += "\`\`\`"
    return response;
}

function parseCartas(cards){
    const splitcards = [];
    let splitindex = 0;
    cards.forEach((element,i) => {
        if (i % 10 == 0){
            splitcards.push([]);
            splitindex++;
        }
        splitcards[splitindex - 1].push(element);
    });
    
    return splitcards.map(
        split => parse(split)
    );
}

module.exports = {parseCartas};