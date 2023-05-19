const helpMessage = `
Usage: yarn start [options]

Options:
  --PORT=<port>                           The port number
  --APP_NAME=<app_name>                   The application name
  --WEB3_URL=<web3_url>                   The Web3 URL
  --INTERVAL_TIME=<interval_time>         The interval time
  --SUBGRAPH_ENABLE=<subgraph_enable>     Enable/disable 1/0 Subgraph
  --CONTRACTS_ENABLE=<contracts_enable>   Enable/disable 1/0 Contracts
  --SUBGRAPH_URL=<subgraph_url>           The Subgraph URL
  --CONFIG_CONTRACTS_PATH=<config_contracts_path>           The config contracts path
  --CONFIG_SUBGRAPH_PATH=<config_subgraph_path>           The config subgraph path

Examples:
  yarn start                             Display help and usage instructions，write the configuration to the .env file
  yarn start --PORT=26666 --APP_NAME=myapp --WEB3_URL=http://example.com --INTERVAL_TIME=10 --SUBGRAPH_ENABLE=1 --CONTRACTS_ENABLE=1 --SUBGRAPH_URL=http://subgraph.example.com --CONFIG_CONTRACTS_PATH=./config/contracts.json --CONFIG_SUBGRAPH_PATH=./config/subgraph.json

Note: You can also pass the options as command-line arguments without the "--" prefix.

`;


console.log(helpMessage);
