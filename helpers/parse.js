function parseCartas(query,showRepeats=false){
    let response = "\`\`\`"
    query.forEach( elem => {
        const repeat = (elem.Cromo && elem.Cromo.cantidad > 1 && showRepeats) ? `[${elem.Cromo.cantidad}]` : '';
        const name = `Personaje: ${elem.nombre}`;
        const rarity = `Rareza: ${elem.rareza}`; 
        const series = `Serie: ${elem.serie}  (${elem.numero})`;
        response += `${repeat.padEnd(5)}${name.padEnd(35)}${rarity.padEnd(12)}${series}\n`;
    });
    response += "\`\`\`"
    return response;
}

module.exports = {parseCartas};