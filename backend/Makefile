.PHONY: build clean deploy
.DEFAULT_GOAL := help

help: ## List all Makefile targets
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

clean: ## Cleanup temporary resources
	rm -rf node_modules/ build/ .dynamodb/

lint: ## Run linters
	tox -e black,flake8

security: ## Run security checks
	tox -e bandit,safety

unit: ## Run unit tests

integration: ## Run unit tests

test: lint security unit integration ## Run tests

install: ## Install backend dependencies
	yarn install
	sls dynamodb install

dynamodb-offline: ## Start dynamodb offline
	sls dynamodb start

dev: ## Run backend locally
	sls offline

deploy: ## Deploy backend to AWS Lambda
	sls deploy

remove: ## Remove backend from AWS Lambda
	sls remove
