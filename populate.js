const fs = require('fs');
const {models} = require('./database');

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
    console.log(seriesName);
    // Process each element in the series
    const seriesElements = seriesLines.slice(1);
    const elementsData = seriesElements.map(element => {
        const [elementName, elementRarity, elementNumber] = element.split(',');
        const carta = {
            nombre: elementName,
            serie:seriesName,
            rareza:elementRarity,
            numero:elementNumber
        }; 
        return carta;
    });
    models.Carta.bulkCreate(elementsData,{validate:true});
});
