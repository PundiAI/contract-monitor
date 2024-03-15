# subgraph search data to Prometheus targets

## 1.what is this?

this is a subgraph query data to Prometheus targets.

## 2.how to use it?

write this project root directory/config/config_subgraph.json file

## 3.config_subgraph.json

config_subgraph.json have three types,one is Single directory query，another is Multiple directory query，the last is Multiple directory condition query.

* first
```json
    {
      "table": "systemStates",
      "requirement": [],
      "metric": [
        {
          "name": "systemStates_totalDebt",
          "type": "gauge",
          "help": "Total debt issued (token.debt)）",
          "labels": [
            {
              "name": "source",
              "value": "vat_debt"
            }
          ],
          "field": "totalDebt",
          "alert_rules": {
            "alert": " systemStates totalDebt change",
            "expr": "abs(systemStates_totalDebt-(systemStates_totalDebt offset 2m)) > systemStates_totalDebt * 0.05",
            "for": "0m",
            "labels": {
              "severity": "warning"
            },
            "annotations": {
              "description": "systemStates totalDebt(vat_debt) have changed in two minutes change more than 5%,change data {{$value}}"
        }
      }
    }
  ]
}

```
{
    systemStates{
        totalDebt
    }
}

* second 

```json
    {
      "table": "collateralPrices",
      "requirement": [
        {
          "name": "skip",
          "parameter": 1
        }
      ],
      "metric": [
        {
          "name": "price_spotPrice",
          "type": "gauge",
          "help": "price_spotPrice",
          "labels": [
            {
              "name": "source",
              "value": "price_spotPrice"
            }
          ],
          "field": "spotPrice"
        }
      ]
    }

```
{
    collateralPrices(skip:1){
        spotPrice
    }
}


Field Explanation

- table: subgraph table name
- requirement: subgraph query condition
- metric: Prometheus targets config
    - name: Prometheus targets name
    - type: Prometheus targets type
    - help: Prometheus targets help
    - labels: Prometheus targets labels
    - field: Prometheus targets field(It is combined with a table to query data)
    - alert_rules: Prometheus targets alert rules

## 4. change apiURL to your subgraph api url

## 5. how to run

subgraph config has success,please go to contract to replace data.

you not need contracts, you can

```
 yarn start
```
