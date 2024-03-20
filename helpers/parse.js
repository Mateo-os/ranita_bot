function parseCartas(query,showRepeats=false){
    let response = "\`\`\`"
    response += "Personaje:".padEnd(30).padStart(7) + "Rareza:".padEnd(12) + "Serie:\n"
    query.forEach( elem => {
        const repeat = (elem.Cromo && elem.Cromo.cantidad > 1 && showRepeats) ? `[+${elem.Cromo.cantidad - 1}]` : '';
        const name = `${elem.nombre}`;
        const rarity = `${elem.rareza}`; 
        const series = `${elem.serie}  (${elem.numero})`;
        response += `${repeat.padEnd(6)}${name.padEnd(25)}${rarity.padEnd(12)}${series}\n`;
    });
    response += "\`\`\`"
    return response;
}

module.exports = {parseCartas};