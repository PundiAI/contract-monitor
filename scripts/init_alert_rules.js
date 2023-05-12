const path = require('path');
const fs = require('fs');
const OpenJsonFileOut = require("./tools.js");
const subgraphConfig = path.join(__dirname, '../config/config_subgraph.json')
const subgraphJsonData = OpenJsonFileOut(subgraphConfig);
const contractConfig = path.join(__dirname, '../config/config_contracts.json')
const contractJsonData = OpenJsonFileOut(contractConfig);

// Create subgraph rules from config_subgraph.json
function CreateSubgraphRules() {
    const subgraphRulesPath = path.join(__dirname, '..', 'prometheus', 'rules', 'subgraph.rules.yml');
    const yamlStr = `groups:
  - name: coast-dao-subgraph-alerts
    rules:`;
    fs.writeFileSync(subgraphRulesPath, yamlStr);
    for (const data of subgraphJsonData) {
        const metrics = data.metric;
        for (const metric of metrics) {
            if (!metric.alert_rules) {
                continue
            }
            const alert = metric.alert_rules.alert;
            const expr = metric.alert_rules.expr;
            const forVal = metric.alert_rules.for;
            const severity = metric.alert_rules.labels.severity;
            const desc = metric.alert_rules.annotations.description;
            const yamlStr = `   
      - alert: ${alert}
        expr: ${expr}
        for: ${forVal}
        labels:
          severity: ${severity}
        annotations:
          description: "${desc}"
    `;
            fs.appendFileSync(subgraphRulesPath, yamlStr);
        }
    }
}

// Create contract rules from config_contracts.json
function CreateContractRules() {
    const contractRulesPath = path.join(__dirname, '..', 'prometheus', 'rules', 'contracts.rules.yml');
    const yamlStr = `groups:
  - name: coast-dao-contract-alerts
    rules:`;
    fs.writeFileSync(contractRulesPath, yamlStr);
    for (const data of contractJsonData) {
        for (const contract of data.functions) {
            for (const output of contract.output) {
                if (!output.alert_rules) {
                    continue
                }
                const alert = output.alert_rules.alert;
                const expr = output.alert_rules.expr;
                const forVal = output.alert_rules.for;
                const severity = output.alert_rules.labels.severity;
                const desc = output.alert_rules.annotations.description;
                const yamlStr = `   
      - alert: ${alert}
        expr: ${expr}
        for: ${forVal}
        labels:
          severity: ${severity}
        annotations:
          description: "${desc}"
    `;
                fs.appendFileSync(contractRulesPath, yamlStr);
            }
        }
    }
}

// save rules to prometheus/rules
function CreateRules() {
    const rulesPath = path.join(__dirname, '..', 'prometheus', 'rules');
    if (!fs.existsSync(rulesPath)) {
        fs.mkdirSync(rulesPath, {recursive: true});
        console.log('create rules dir')
    }
    console.log('start create subgraph rules')
    CreateSubgraphRules();
    console.log('start create contract rules')
    CreateContractRules();
    console.log('end create rules')
}

CreateRules();