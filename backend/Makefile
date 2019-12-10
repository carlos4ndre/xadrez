.PHONY: build clean deploy
.DEFAULT_GOAL := help

help: ## List all Makefile targets
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

clean: ## Cleanup temporary resources
	rm -rf node_modules/ build/

build: ## Build backend
	yarn install

dev: ## Run backend locally
	sls dynamodb install
	sls offline --verbose

deploy: ## Deploy backend to AWS Lambda
	sls deploy --verbose

remove: ## Remove backend from AWS Lambda
	sls remove --verbose
