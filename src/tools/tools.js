const {Gauge} = require("prom-client");
const fs = require('fs');

// return a new Gauge object
function CreateNewGuage(metricName, metricHelp, metricLabels) {
    return new Gauge({
        name: metricName, help: metricHelp, labelNames: metricLabels,
    });
}

// convert value to string, or return empty string if value is null or undefined
function ToStringSafe(value) {
    try {
        return value.toString();
    } catch (err) {
        console.error(`Failed to convert ${value} to string: ${err}`);
        return "";
    }
}

// parse string to number, or return null if string is not a number
function SafeParseNumber(str) {
    try {
        return Number(str);
    } catch (err) {
        console.error(`Error parsing number: ${err}`);
        return null;
    }
}

// open a json file and return the parsed json object
function OpenJsonFile(path) {
    try {
        const data = fs.readFileSync(path, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.error(`Failed to read config file ${path}: file does not exist`);
        } else {
            console.error(`Failed to read or parse config file ${path}: ${err.message}`);
        }
        process.exit(1);
    }
}


module.exports = {
    CreateNewGuage,
    ToStringSafe,
    SafeParseNumber,
    OpenJsonFile
}


