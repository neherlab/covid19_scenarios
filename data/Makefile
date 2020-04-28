
.PHONY: all clean data-for-app data-for-app

all: clean types data-for-app

clean: clean-types

clean-types:
	rm -rf generated/**

types: clean-types
	cd .. && yarn install && yarn schema:totypes

tsv-data:
	python3 generate_data.py \
		--fetch

recalculated-fits:
	python3 generate_data.py \
		--recalculate \
		--num-threads 10 \
		--output-scenarios ../src/assets/data/scenarios/scenarios.json \
		--output-cases ../src/assets/data/caseCounts.json

population:
	python3 generate_data.py \
		--output-population populationData.tsv

cases:
	python3 generate_data.py \
		--output-cases ../src/assets/data/caseCounts.json

scenarios:
	python3 generate_data.py \
		--output-scenarios ../src/assets/data/scenarios/scenarios.json

test-scenarios:
	python3 generate_data.py \
		--output-scenarios test.json

test-cases:
	python3 generate_data.py \
		--output-cases test.json

data-for-app: cases scenarios
