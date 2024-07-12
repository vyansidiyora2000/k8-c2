const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const PORT = 7000;

app.post('/calculate', (req, res) => {
    const { file, product } = req.body;
    console.log("inside calclate in c1")

    if (!file || !product) {
        return res.status(400).json({ file: null, error: 'Invalid JSON input.' });
    }

    const filePath = path.join('./VYANSI_PV_dir', file);
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ file, error: 'File not found.' });
    }

 

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading the file.' });
        }

        const lines = data.trim().split('\n'); 

        let sum = 0;
        let isValidCSV = true;
        let isFirstLine = true;
        let expectedColumns = 0;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            const values = line.split(',').map(value => value.trim()); 

            if (isFirstLine && values.length !==2) {
                isValidCSV = false;
                break;
            }

            if (isFirstLine) {
                expectedColumns = values.length;
                isFirstLine = false;
            } else {
                if (values.length !== expectedColumns) {
                    isValidCSV = false;
                    break;
                }
            }

            const [prod, amount] = values;
            if (prod === product) {
                const parsedAmount = parseInt(amount, 10);
                if (!isNaN(parsedAmount)) {
                    sum += parsedAmount;
                }
            }
        }

        if (!isValidCSV) {
            return res.status(400).json({ file, error: 'Input file not in CSV format.' });
        }
        
        return res.json({ file, sum });
    });
});
  

app.listen(PORT, () => {
    console.log(`Container 2 listening on port ${PORT}`);
});

