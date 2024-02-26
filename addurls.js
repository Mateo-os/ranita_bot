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
    // Extract series name
    const seriesHeader = seriesLines[0].split(' ');
    seriesHeader.pop();
    const seriesName = seriesHeader.join(' ');
    // Process each element in the series
    const seriesElements = seriesLines.slice(1);
    seriesElements.forEach(element => {
        const [elementName, elementRarity, elementNumber, elementURL] = element.split(',');
        // Update the URL for existing entry in the database
        models.Carta.findOne({
            where: {
                nombre: elementName,
                serie: seriesName
            }
        }).then(carta => {
            if (carta) {
                carta.update({ URLimagen: elementURL })
                    .then(() => {
                        console.log(`Updated URL for ${elementName} in ${seriesName}`);
                    })
                    .catch(error => {
                        console.error(`Error updating URL for ${elementName} in ${seriesName}: ${error.message}`);
                    });
            } else {
                console.log(`No entry found for ${elementName} in ${seriesName}`);
            }
        }).catch(error => {
            console.error(`Error finding ${elementName} in ${seriesName}: ${error.message}`);
        });
    });
});
