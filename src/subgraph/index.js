const {CreateNewGuage, ToStringSafe, SafeParseNumber, OpenJsonFile} = require("../tools/tools");
const axios = require('axios')
require('dotenv').config();
const path = require('path');
const config = path.join(__dirname, '../../config/config_subgraph.json')
let jsonData = OpenJsonFile(config);

// query graph node subgraph data
// use axios to send post request and return data
QueryGRN = (body) => {
    let data = axios.post(process.env.SubgraphApiUrl, {
        query: body
    })
        .then((res) => {
            data = res.data.data;
            return data
        })
        .catch((error) => {
            console.error(error)
        })
    return data
}

// initialize query statement in src/index.js only once.
// use config_subgraph.json to splice query statement and return
function SplicingQueryStatements() {
    let query = "{\n";
    for (const data of jsonData) {
        const table = data.table;
        const metrics = data.metric;
        query += `  ${table}`
        if (data.requirement.length > 0) {
            query += `(`
            data.requirement.forEach((requirement) => {
                query += `${requirement.name}:${requirement.parameter},`
            })
            query = query.substring(0, query.length - 1);
            query += `)`

        }
        query += `{\n`;
        query += `    id \n`;
        for (const metric of metrics) {
            const name = metric.field;
            query += `    ${name}\n`;
        }
        query += "  }\n";
    }
    query += "}";
    return query
}

// batch production guage in prometheus
// Recurring call to update prometheus gauge value
async function SubgraphBatchProductionMetric (graphQueryStatement, register) {
    const SqlDate = await QueryGRN(graphQueryStatement);
    jsonData.forEach(table => {
        const {table: tableName} = table;
        table.metric.forEach(metric => {
            const {name: metricName, help: metricHelp, labels: metricLabels, field: metricField} = metric;
            const gaugeTarget = register.getSingleMetric(metricName);
            const labelsName = [...metricLabels.map(label => label.name), 'id', 'table'];
            const number = SqlDate[tableName].length;
            for (let i = 0; i < number; i++) {
                const labelsValue = [...metricLabels.map(label => label.value), ToStringSafe(SqlDate[tableName][i].id), tableName];
                const value = SafeParseNumber(SqlDate[tableName][i][metricField]);
                let gauge;
                if (gaugeTarget) {
                    gauge = gaugeTarget;
                } else {
                    gauge = CreateNewGuage(metricName, metricHelp, labelsName);
                    register.registerMetric(gauge);
                }
                gauge.labels(...labelsValue).set(value);
            }
        });
    });
}

module.exports = {
    SplicingQueryStatements,
    SubgraphBatchProductionMetric
}