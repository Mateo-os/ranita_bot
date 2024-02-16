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
        const [elementName, elementRarity, elementNumber] = element.split(',');
        // Check if the card already exists in the database
        models.Carta.findOrCreate({
            where: {
                nombre: elementName,
                serie: seriesName
            },
            defaults: {
                rareza: elementRarity,
                numero: elementNumber
            }
        }).then(([carta, created]) => {
            if (created) {
                console.log(`Added ${elementName} to ${seriesName}`);
            } else {
                console.log(`Skipped duplicate entry for ${elementName} in ${seriesName}`);
            }
        }).catch(error => {
            console.error(`Error adding ${elementName} to ${seriesName}: ${error.message}`);
        });
    });
});
