const axios = require('axios');
const fs = require('fs');
require('dotenv').config();
const path = require('path');
const OpenJsonFileOut = require("./tools.js");
const config = path.join(__dirname, '../config/config_contracts.json')
const chainContractsDates = OpenJsonFileOut(config);
const ETHERSCAN_API_URL = 'https://api.etherscan.io/api';
// becase if you use node getAbis.js, it can't get the env value,so it can write the apikey here
const EthScanApiKey = process.env.EthScanApiKey || 'YourApiKeyToken';
// it can use different network, this list less network,you can add more network
const supportedNetworks = ['ethereum', 'goerli'];

// get abi by contract address in etherscan api
async function getAbiByContractAddr(network, address) {
    const url = `${ETHERSCAN_API_URL}?module=contract&action=getabi&address=${address}&apikey=${EthScanApiKey}`;
    const response = await axios.get(url);
    if (response.data.result) {
        return response.data.result;
    }
    console.error(`Failed to retrieve ABI for address: ${address}`);
    return null;
}

// download abi and save to contracts/abis
async function downloadAbis() {
    // mkdir abis dir
    const abiPath = path.join(__dirname, '..', 'contracts', 'abis');
    if (!fs.existsSync(abiPath)) {
        fs.mkdirSync(abiPath, {recursive: true});
    }
    for (const contract of chainContractsDates) {
        if (!supportedNetworks.includes(contract.network)) {
            console.log(`not support network ${contract.network}`)
            continue
        }
        const abiPath = path.join(__dirname, '..', 'contracts', 'abis', contract.network);
        const abiFilePath = path.join(abiPath, `${contract.contract_name}.json`);
        if (!fs.existsSync(abiPath)) {
            fs.mkdirSync(abiPath, {recursive: true});
        }
        if (!fs.existsSync(abiFilePath)) {
            const abi = await getAbiByContractAddr(contract.network, contract.address);
            fs.writeFileSync(abiFilePath, abi);
            console.log(`ABI for contract ${contract.contract_name} on network ${contract.network} downloaded to ${abiFilePath}`);
        } else {
            console.log(`ABI for contract ${contract.contract_name} on network ${contract.network} already exists at ${abiFilePath}`);
        }
    }
}

// choice config want to use abi function and save to contracts/abis
// is config not have functions, it will use all abi function
async function choiceAbiFunctions() {
    for (const contract of chainContractsDates) {
        const abi = require(`../contracts/abis/${contract.network}/${contract.contract_name}.json`);
        const newAbi = [];
        const abiPath = path.join(__dirname, '..', 'contracts', 'abis', contract.network);
        const abiFilePath = path.join(abiPath, `${contract.contract_name}.json`);
        if (!fs.existsSync(abiFilePath)) {
            fs.rmSync(abiFilePath);
        }
        if (!contract.functions) {
            // if not have functions, it will use all view && pure && not input functions
            for (const item of abi) {
                if (item.stateMutability === "view" || item.stateMutability === "pure" || item.inputs.length === 0) {
                    newAbi.push(item)
                }
            }
            fs.writeFileSync(abiFilePath, JSON.stringify(newAbi));
            console.log(`${contract.contract_name} not have functions, so use all view && pure && not input functions`)
            continue
        }
        for (const func of contract.functions) {
            for (const item of abi) {
                if (item.name === func.fun_name) {
                    newAbi.push(item)
                }
            }
        }
        fs.writeFileSync(abiFilePath, JSON.stringify(newAbi));
        console.log(`new ABI for contract ${contract.contract_name} on network ${contract.network} downloaded to ${abiFilePath}`);
    }
}

async function GetContractsAbi() {
    try {
        await downloadAbis();
        console.log("download success")
    } catch (error) {
        console.error(error);
    }
    try {
        await choiceAbiFunctions();
        console.log("choice success")
    } catch (error) {
        console.error(error);
    }
    console.log("end")
}


GetContractsAbi().then(() => {
    console.log("success")
}).catch((error) => {
    console.error(error);
});