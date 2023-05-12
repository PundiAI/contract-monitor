# monitor

## Usage

    1.yarn
    2.yarn start

## Description

    this can open http://localhos:26680 prometheus
    data from subgraph in graph node
    use axios to get data from subgraph,and write to prometheus

    support solidity contracts pure and view query funcrion returns data turn into prometheus targets
    support every evm chain

## How to use

- write config folder
    - write config_subgraph.json
    - write config_contract.json

- in script folder
    - yarn get-abis  or   node scripts/get_abi.js 
    - yarn init-rules    or   node scripts/init_alert_rules.js

- write .env

- cp abis to /src/contracts

- yarn start 

## config_subgraph.json

detailed description: [subgraph docs](https://github.com/coastdao/monitor/blob/coastdao/monitor/src/subgraph/README.md)

## config_contract.json

detailed description: [contract docs](https://github.com/coastdao/monitor/blob/coastdao/monitor/src/contracts/README.md)

## getAbis

- it will get abi from config_contract.json and write to abis for monitor/
    - if you not have functions field in config_contract.json, it can let all view && pure function in abis.
- copy this folder to monitor/src/contracts(if you use docker please docker -v "$OUT_DIR/abis":/app/src/contracts/abis)

## initRules

- it will get alert_rules from config_subgraph.json and config_contract.json and write to rules for
  monitor/prometheus/rules
    - it This is used to start prometheus server and add alert rules

## .env

- InfuraKey: infura key
- SubgraphUrl: subgraph url
- PORT: prometheus port
- EthScanApiKey: etherscan api key
- TestChain: testchain url
- AppName: app name
- IntervalTime: interval time (search subgraph and contract time & 10000 => 10s 60000 => 1min)
- SubgraphSwitch: 1 or 0 (1=>open subgraph 0=>close subgraph)(default 1)
- ContractsSwitch: 1 or 0 (1=>open contracts 0=>close contracts)(default 1)

For example:

```env
InfuraKey=''
SubgraphApiUrl='http://localhost:8000/subgraphs/name/protofire/maker-protocol'
PORT=26660
EthScanApiKey=''
TestChain='http://localhost:8545'
AppName=''
IntervalTime=10000
SubgraphSwitch=1
ContractsSwitch=1
```

## docker

- dockerfile
    - docker build -t ghcr.io/coastdao/monitor . or docker pull ghcr.io/coastdao/monitor:latest
    - docker run -d \
      -p 26660:26660 \
      -v "$OUT_DIR/config":/app/config \
      -v "$OUT_DIR/.env":/app/.env \
      -v "$OUT_DIR/abis":/app/src/contracts/abis \
      --name monitor \
      ghcr.io/coastdao/monitor:latest

- docker-compose
    - docker-compose up -d

