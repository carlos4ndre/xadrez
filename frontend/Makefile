.PHONY: build clean deploy
.DEFAULT_GOAL := help

help: ## List all Makefile targets
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

clean: ## Cleanup temporary resources
	rm -rf node_modules/

build: clean ## Build frontend
	yarn install && npm run build

deploy: ## Deploy frontend to S3
	sls client deploy --verbose

remove: ## Remove frontend to S3
	sls client remove --verbose
