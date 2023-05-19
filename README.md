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

- write .env or command

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

- PORT: prometheus port (default 26666)
- WEB3_URL: WEB3 URL
- APP_NAME: app name
- INTERVAL_TIME：interval time (search subgraph and contract time & 1 => 1m,default 1m)
- SUBGRAPH_ENABLE：1 or 0 (1=>open subgraph 0=>close subgraph)(default 1)
- CONTRACTS_ENABLE：1 or 0 (1=>open contracts 0=>close contracts)(default 1)
- SUBGRAPH_URL：subgraph url
- CONFIG_SUBGRAPH_PATH：config subgraph path(default ./config/config_subgraph.json)
- CONFIG_CONTRACTS_PATH：config contracts path(default ./config/config_contract.json)

For example:

```env
PORT=
WEB3_URL=
APP_NAME=
INTERVAL_TIME=
SUBGRAPH_ENABLE=
CONTRACTS_ENABLE=
SUBGRAPH_URL=
CONFIG_SUBGRAPH_PATH=
CONFIG_CONTRACTS_PATH=
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

## help

```shell
    yarn helps
```

Usage: yarn start [options]

Options:
--PORT=<port>                           The port number
--APP_NAME=<app_name>                   The application name
--WEB3_URL=<web3_url>                   The Web3 URL
--INTERVAL_TIME=<interval_time>         The interval time
--SUBGRAPH_ENABLE=<subgraph_enable>     Enable/disable 1/0 Subgraph
--CONTRACTS_ENABLE=<contracts_enable>   Enable/disable 1/0 Contracts
--SUBGRAPH_URL=<subgraph_url>           The Subgraph URL
--CONFIG_CONTRACTS_PATH=<config_contracts_path> The config contracts path
--CONFIG_SUBGRAPH_PATH=<config_subgraph_path> The config subgraph path

Examples:
yarn start                             Display help and usage instructions，write the configuration to the .env file
yarn start --PORT=26666 --APP_NAME=myapp --WEB3_URL=http://example.com --INTERVAL_TIME=10 --SUBGRAPH_ENABLE=1 --CONTRACTS_ENABLE=1 --SUBGRAPH_URL=http://subgraph.example.com --CONFIG_CONTRACTS_PATH=/Home/config/config_contract.json --CONFIG_SUBGRAPH_PATH=/Home/config/config_subgraph.json

Note: You can also pass the options as command-line arguments without the "--" prefix.



yarn start --PORT=26666 --APP_NAME=maker_dao --WEB3_URL=http://localhost:8545 --INTERVAL_TIME=0.5 --SUBGRAPH_ENABLE=1 --CONTRACTS_ENABLE=1 --SUBGRAPH_URL=http://subgraph.example.com --CONFIG_CONTRACTS_PATH=/Home/config/config_contract.json --CONFIG_SUBGRAPH_PATH=/Home/config/config_subgraph.json
```
