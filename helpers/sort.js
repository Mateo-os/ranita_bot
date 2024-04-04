
function orderCards(c1, c2){
    //ORDER CRITERIA: 
    // 1. DESCENDING BY RARITY
    // 2. ALPHABETICAL BY SERIES
    // 3. ASCENDING BY NUMBER 
    if(c1.rareza != c2.rareza)
        return c2.rareza - c1.rareza;
    const strcomp = c1.serie.localeCompare(c2.serie);
    if (strcomp != 0)
        return strcomp;
    return c1.numero - c2.numero;
}

module.exports = {orderCards};