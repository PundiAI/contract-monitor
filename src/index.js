let express = require('express');
let app = express();
const client = require('prom-client');
const register = new client.Registry()
const {ContractsBatchProductionMetric, NewWeb3AndContract} = require("./contracts");
const {SplicingQueryStatements, SubgraphBatchProductionMetric} = require("./subgraph");
const {SetENV} = require("./tools/cmd");
require('dotenv').config();

let {PORT, APP_NAME, WEB3_URL, INTERVAL_TIME, SUBGRAPH_ENABLE, CONTRACTS_ENABLE, SUBGRAPH_URL} = SetENV();
if (!PORT || !APP_NAME || !WEB3_URL || !INTERVAL_TIME || !SUBGRAPH_ENABLE || !CONTRACTS_ENABLE || !SUBGRAPH_URL) {
    PORT = PORT || process.env.PORT;
    APP_NAME = APP_NAME || process.env.APP_NAME;
    WEB3_URL = WEB3_URL || process.env.WEB3_URL;
    INTERVAL_TIME = INTERVAL_TIME || process.env.INTERVAL_TIME;
    SUBGRAPH_ENABLE = SUBGRAPH_ENABLE || process.env.SUBGRAPH_ENABLE;
    CONTRACTS_ENABLE = CONTRACTS_ENABLE || process.env.CONTRACTS_ENABLE;
    SUBGRAPH_URL = SUBGRAPH_URL || process.env.SUBGRAPH_URL;

}
console.log(`start load env: PORT:${PORT}, APP_NAME:${APP_NAME}, WEB3_URL:${WEB3_URL}, INTERVAL_TIME:${INTERVAL_TIME}, SUBGRAPH_ENABLE:${SUBGRAPH_ENABLE}, CONTRACTS_ENABLE:${CONTRACTS_ENABLE}, SUBGRAPH_URL:${SUBGRAPH_URL}`)


register.setDefaultLabels({
    app: APP_NAME || 'app',
})

async function main(graphQueryStatement, Contracts, SubgraphEnable, ContractsEnable) {
    if (SubgraphEnable === "1") {
        try {
            await SubgraphBatchProductionMetric(graphQueryStatement, register,SUBGRAPH_URL)
        } catch (error) {
            console.error("SubgraphBatchProductionMetric", error);
        }
    }
    if (ContractsEnable === "1") {
        try {
            await ContractsBatchProductionMetric(register, Contracts)
        } catch (error) {
            console.error("ContractsBatchProductionMetric", error);
        }
    }
    console.log("Update success", new Date().toLocaleString());
}

async function run() {
    const graphQueryStatement = SplicingQueryStatements();
    const Contracts = NewWeb3AndContract(WEB3_URL);
    const SubgraphEnable = SUBGRAPH_ENABLE || "1"
    const ContractsEnable = CONTRACTS_ENABLE || "1"
    setInterval(async () => {
        await main(graphQueryStatement, Contracts, SubgraphEnable, ContractsEnable);
    }, INTERVAL_TIME * 60000 || 10000);
}


app.get('/metrics', async function (req, res) {
    res.set('Content-Type', register.contentType);
    let metrics = await register.metrics();
    res.send(metrics);
})
const port = PORT || 26666;

let index = app.listen(port, function () {
    let port = index.address().port
    console.log("Application running on port: %s", port)
    run();
})






