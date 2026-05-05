# FabricShift Python CLI

Standalone Python implementation of the FabricShift migration readiness workbench.  
All data is reference fixtures — not for production use.

## Install

```bash
cd fabricshift
pip install -e .
```

## Usage

```bash
# Run readiness assessment for all data products
fabricshift assess

# Generate migration wave plan
fabricshift waves --max-waves 4

# Export full assessment to JSON
fabricshift export --output my_assessment.json
```

## Module API

```python
from fabricshift.fixtures import get_data_products, get_domains
from fabricshift.readiness import assess_all
from fabricshift.waves import plan_waves

products = get_data_products()
domains = {d.domain_name: d.criticality for d in get_domains()}
results = assess_all(products, domains)
waves = plan_waves(products, results)
```
