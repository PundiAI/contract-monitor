let express = require('express');
let app = express();
const client = require('prom-client');
const register = new client.Registry()
const {ContractsBatchProductionMetric, NewWeb3AndContract} = require("./contracts");
const {SplicingQueryStatements, SubgraphBatchProductionMetric} = require("./subgraph");
require('dotenv').config();

register.setDefaultLabels({
    app: process.env.AppName || 'app',
})

async function main(graphQueryStatement, Contracts,SubgraphSwitch,ContractsSwitch) {
    if (SubgraphSwitch === "1") {
        try {
            await SubgraphBatchProductionMetric(graphQueryStatement, register)
        } catch (error) {
            console.error("SubgraphBatchProductionMetric",error);
        }
    }
    if (ContractsSwitch === "1") {
        try {
            await ContractsBatchProductionMetric(register, Contracts)
        } catch (error) {
            console.error("ContractsBatchProductionMetric",error);
        }
    }
    console.log("Update success", new Date().toLocaleString());
}

async function run() {
    const graphQueryStatement = SplicingQueryStatements();
    const Contracts = NewWeb3AndContract();
    const SubgraphSwitch = process.env.SubgraphSwitch || "1"
    const ContractsSwitch = process.env.ContractsSwitch || "1"
    setInterval(async () => {
        await main(graphQueryStatement, Contracts,SubgraphSwitch,ContractsSwitch);
    }, process.env.IntervalTime || 10000);
}


app.get('/metrics', async function (req, res) {
    res.set('Content-Type', register.contentType);
    let metrics = await register.metrics();
    res.send(metrics);
})
const port = process.env.PORT || 26680;

let index = app.listen(port, function () {
    let port = index.address().port
    console.log("Application running on port: %s", port)
    run();
})






