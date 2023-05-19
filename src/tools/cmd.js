function GetENV(NAME){
    const args = process.argv.slice(2);
    const options = {};

    args.forEach(arg => {
        const [key, value] = arg.split('=');
        if (key && value) {
            options[key.replace('--', '')] = value;
        }
    });
    return options[NAME]
}

function SetENV() {
    const PORT = GetENV("PORT");
    const APP_NAME = GetENV("APP_NAME");
    const WEB3_URL = GetENV("WEB3_URL");
    const INTERVAL_TIME = GetENV("INTERVAL_TIME");
    const SUBGRAPH_ENABLE = GetENV("SUBGRAPH_ENABLE");
    const CONTRACTS_ENABLE = GetENV("CONTRACTS_ENABLE");
    const SUBGRAPH_URL = GetENV("SUBGRAPH_URL");
    return {PORT, APP_NAME, WEB3_URL, INTERVAL_TIME, SUBGRAPH_ENABLE, CONTRACTS_ENABLE, SUBGRAPH_URL}
}


module.exports = {
    GetENV,
    SetENV
}