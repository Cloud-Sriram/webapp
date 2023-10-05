const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const loadCSV = (filePath = path.join(__dirname, '..', 'opt', 'users.csv')) => {
    const results = [];
    
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                resolve(results);
            })
            .on('error', reject);
    });
};

module.exports = {
    loadCSV
};
