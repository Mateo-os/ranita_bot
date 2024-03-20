function parse(query,showRepeats=false){
    let response = "\`\`\`"
    response += "Personaje:".padEnd(26) + "Rareza:".padEnd(12) + "Serie:\n"
    query.forEach( elem => {
        const repeat = (elem.Cromo && elem.Cromo.cantidad > 1 && showRepeats) ? `[+${elem.Cromo.cantidad - 1}]` : '';
        const name = `${elem.nombre.length <= 21 ? elem.nombre : elem.nombre.slice(0,17) + '...'}`;
        const rarity = `${elem.rareza}`; 
        const series = `${elem.serie}  (${elem.numero})`;
        response += `${repeat.padEnd(6)}${name.padEnd(25)}${rarity.padEnd(9)}${series}\n`;
    });
    response += "\`\`\`"
    return response;
}

function parseCartas(cards,showRepeats=false){
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
        split => parse(split, showRepeats)
    );
}


module.exports = {parseCartas};

