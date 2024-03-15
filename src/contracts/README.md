# Contracts view&&pure fun Prometheus metrics generator

## 1.what is this?

This is a simple tool to generate prometheus targets for view&&pure fun contracts.

## 2.how to use?

write this project root directory/config/config_contracts.json file

yarn get-abis or node /scripts/get_abis.js
    
if you abi cannot use Etherscan to pull,you can mkdir abis folder in root directory, and put your abi file in abis folder.
for example tree:
```
.
    └── abis
        └── testchain
            ├── test2.json
            └── test.json

```

## 3.how to write config_contracts.json

please input your want monitor contract config in this part.

For example:
```json

{
  "name": "PIP_ETH",
  "contract_name": "OSM",
  "address": "0x430a901cCBB48F0363E9cf0756a19ff1F549Ab90",
  "network": "testchain",
  "abi_path": "./abis/testchain/OSM.json",
  "functions": [
    {
      "fun_name": "peek",
      "from": "0xe196908c3641A02A4E60651427cc8A3E061b4D29",
      "input": [],
      "output": [
        {
          "serial_number": 0,
          "metric_name": "PEEK",
          "metric_help": "ETH-A price value",
          "alert_rules": {
            "alert": "makerdao ilk ETH-A price more than 5%",
            "expr": "(abs(PIP_ETH_PEEK - (PIP_ETH_PEEK offset 60m)))/1e+18  > ((PIP_ETH_PEEK offset 60m) * 0.05) / 1e+18",
            "for": "0m",
            "labels": {
              "severity": "warning"
            },
            "annotations": {
              "description": "makerdao ilk ETH-A price more than 5% :{{$value}}"
            }
          }
        }
      ]
    }
  ]
}


```

solidity contract is this

```solidity
pragma solidity >=0.5.10;

contract OSM {
    function peek() external view toll returns (bytes32, bool) {
        return (bytes32(uint(cur.val)), cur.has == 1);
    }
}
```

this function must have whitelist can call, so you must input from address.

or

```json
  {
  "name": "testContract",
  "contract_name": "test",
  "address": "0xe8dE510b3C02e44321E9cb65337A7E542c7aB486",
  "network": "testchain",
  "abi_path": "./abis/testchain/test.json",
  "functions": [
    {
      "fun_name": "getDatas",
      "input": [
        "10",
        "20"
      ],
      "output": [
        {
          "serial_number": 0,
          "metric_name": "a",
          "metric_help": "a value"
        },
        {
          "serial_number": 1,
          "metric_name": "b",
          "metric_help": "b value"
        },
        {
          "serial_number": 2,
          "metric_name": "c",
          "metric_help": "a+b value"
        }
      ]
    }
  ]
}
```

solidity contract is this testContract_a  testContract_b  testContract_c

{$name}+"_"+{$output.metric_name}

```solidity
pragma solidity ^0.8.0;

contract test {
    function getDatas(uint256 a, uint256 b) public view returns (uint256, uint256, uint256){
        return (a, b, a + b);
    }
}
```

it can create three metrics.

Field Explanation

- name: deploy contract name (Used to distinguish between different data with the same contract code)
- contract_name: contract name (The function is to locate specific contracts through this name and then pull ABI from
  ETHSCAN)
- address: contract address
- network: contract network
- abiPath: contract abi path (must './abis/ethereum/$contract_name.json')
- functions: contract functions
    - fun_name: function name
    - from: contract caller address
    - input: function input
    - output: function output
        - serial_number: output serial number
        - metric_name: output metric name
        - metric_help: output metric help
    - alert_rules: alert rules
        - alert: alert name
        - expr: alertManage monitor regular
        - for: time
        - labels: alert labels monitor level
        - annotations: alert description

## 4. how to run

contracts config has success,please go to subgraph to replace data.

you not have subgraph, you can

```
 yarn start
```

