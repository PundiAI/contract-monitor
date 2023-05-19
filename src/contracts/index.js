const Web3 = require("web3");
require('dotenv').config();
const {CreateNewGuage, SafeParseNumber, OpenJsonFile} = require("../tools/tools");
const path = require('path');
const {GetENV} = require("../tools/cmd");
const config = path.join(__dirname, '../../config/config_contracts.json')
const CONFIG_CONTRACTS_PATH = GetENV('CONFIG_CONTRACTS_PATH')||process.env.CONFIG_CONTRACTS_PATH || config;
const chainContractsDates = OpenJsonFile(CONFIG_CONTRACTS_PATH);


// traverse all contract, return targets array
// Selective input to call contract input parameter
// from :it can use 'from' to call certain special functions
// The return value may be one or multiple values，multiple type is object, single type is string
async function traverseAllContract(contract, Data) {
    const {name: contractName, functions: functions} = Data;
    const targets = [];
    for (const fun of functions) {
        const {fun_name, from, input, output} = fun;
        const parameter = input || [];
        let result = await contract.methods[fun_name](...parameter).call({from: from || ''});
        for (const out of output) {
            const {serial_number, metric_name, metric_help} = out;
            let targetValue = result;
            if (typeof result === "object") {
                targetValue = result[serial_number];
            }
            targets.push({
                name: contractName  + "_" + metric_name,
                value: targetValue,
                help: metric_help
            });
        }
    }
    return targets;
}

// init web3 and contract, return contract array
// Run during project initialization(src/index.js)
function NewWeb3AndContract(WEB3_URL) {
    const Contracts = [];
    for (let i = 0; i < chainContractsDates.length; i++) {
        const web3 = new Web3(WEB3_URL);
        const contractAbi = require(chainContractsDates[i].abi_path);
        const contract = new web3.eth.Contract(contractAbi, chainContractsDates[i].address);
        Contracts.push(contract);
    }
    return Contracts
}


// Get contract data and push to prometheus
// Recurring call to update prometheus gauge value
// need to pass in the register and contract array(contract can be obtained by calling NewWeb3AndContract)
async function ContractsBatchProductionMetric(register, Contracts) {
    for (let i = 0; i < chainContractsDates.length; i++) {
        const chainContractsData = chainContractsDates[i];
        const contract = Contracts[i];
        const targets = await traverseAllContract(contract, chainContractsData);
        targets.forEach(target => {
            const {name: metricName, value: metricValue, help: metricHelp} = target;
            const gaugeTarget = register.getSingleMetric(metricName);
            const metricLabels = ['contract_name', 'contract_address', 'network'];
            const labels = [chainContractsData.name, chainContractsData.address, chainContractsData.network];
            let gauge;
            if (gaugeTarget) {
                gauge = gaugeTarget;
            } else {
                gauge = CreateNewGuage(metricName, metricHelp, metricLabels);
                register.registerMetric(gauge);
            }
            gauge.labels(...labels).set(SafeParseNumber(metricValue));
        });
    }
}

module.exports = {
    NewWeb3AndContract,
    ContractsBatchProductionMetric
}