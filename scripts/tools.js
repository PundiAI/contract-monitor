const fs = require("fs");

// OpenJsonFileOut opens a JSON file and returns the parsed JSON.
function OpenJsonFileOut(path) {
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

module.exports = OpenJsonFileOut;