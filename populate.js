const fs = require('fs');
const { models } = require('./database');

// Read the file content
const fileContent = fs.readFileSync('personajes_album.txt', 'utf8');

// Split the content into series
const seriesArray = fileContent.split('\n\n');

// Process each series
seriesArray.forEach(series => {
    // Split series into lines
    const seriesLines = series.split('\n');
    // Extract series name and length
    const seriesHeader = seriesLines[0].split(' ');
    seriesHeader.pop();
    const seriesName = seriesHeader.join(' ');
    // Process each element in the series
    const seriesElements = seriesLines.slice(1);
    seriesElements.forEach(element => {
        const [elementName, elementRarity, elementNumber, elementURL] = element.split(',');
        // Check if the card already exists in the database
        models.Carta.findOrCreate({
            where: {
                nombre: elementName,
                serie: seriesName
            },
            defaults: {
                rareza: elementRarity,
                numero: elementNumber,
                URLimagen: elementURL
            }
        }).then(([carta, created]) => {
            if (created) {
                console.log(`Added ${elementName} to ${seriesName}`);
            } else {
                let change = false;
                let output = '';
                let changes = '';
                if(carta.numero != elementNumber) {
                    changes += `Number changed from ${carta.numero} to ${elementNumber}. ` 
                    carta.numero = elementNumber;
                    change = true;
                }else if(carta.rareza != elementRarity){
                    changes += `Rarity changed from ${carta.rareza} to ${elementRarity}. `;
                    carta.rareza = elementRarity;
                    change = true;
                }else if(carta.URLimagen != elementURL){
                    changes += `URL changed from ${carta.URLimagen} to ${elementURL}. `;
                    carta.URLimagen = elementURL;
                    change = true;
                }
                if(change){
                    output = `Detected changes for ${elementName} in ${seriesName}: ${changes}`;
                    carta.save();
                } else{
                    output = `Skipped duplicate entry for ${elementName} in ${seriesName}.`;
                }
                console.log(output);
            }
        }).catch(error => {
            console.error(`Error adding ${elementName} to ${seriesName}: ${error.message}`);
        });
    });
});
