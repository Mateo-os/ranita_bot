const fs = require('fs');
const {sequelize, models} = require('./database');

// Read the file content
const fileContent = fs.readFileSync('personajes_album.txt', 'utf8');

// Split the content into series
const seriesArray = fileContent.split('\n\n');

// Process each series
const databaseData = [];

seriesArray.forEach(series => {
    // Split series into lines
    const seriesLines = series.split('\n');
    // Extract series name and length
    const seriesHeader = seriesLines[0].split(' ');
    seriesHeader.pop();
    const seriesName = seriesHeader.join(' ');

    // Process each element in the series
    const seriesElements = seriesLines.slice(1);
    const elementsData = seriesElements.map(element => {
        const [elementName, elementRarity, elementNumber] = element.split(',');
        const carta = models.Carta.build({
            nombre: elementName,
            serie:
            seriesName,
            rareza:elementRarity,
            numero:elementNumber
        }); 
        console.log(carta.toJSON())
        return carta;
    });

    // Add series data to the databaseData array
    databaseData.push({ series: seriesName, elements: elementsData });
});

// Display the extracted data
console.log(databaseData);