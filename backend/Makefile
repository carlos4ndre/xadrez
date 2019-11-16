.PHONY: build clean deploy
.DEFAULT_GOAL := help

help: ## List all Makefile targets
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

build: ## Build project artifacts
	dep ensure -v
	env GOOS=linux go build -ldflags="-s -w" -o bin/lambda/websocket/connect backend/lambda/websocket/connect.go
	env GOOS=linux go build -ldflags="-s -w" -o bin/lambda/websocket/disconnect backend/lambda/websocket/disconnect.go

clean: ## Cleanup temporary resources
	rm -rf ./bin ./vendor Gopkg.lock

deploy: clean build ## Deploy project to AWS Lambda
	sls deploy --verbose

remove: ## Remove project from AWS Lambda
	sls remove --verbose
