.PHONY: build clean deploy
.DEFAULT_GOAL := help

help: ## List all Makefile targets
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

clean: ## Cleanup temporary resources
	rm -rf ./bin ./vendor Gopkg.lock

build: clean ## Build backend
	dep ensure -v
	env GOOS=linux go build -ldflags="-s -w" -o bin/lambda/websocket/connect lambda/websocket/connect.go
	env GOOS=linux go build -ldflags="-s -w" -o bin/lambda/websocket/disconnect lambda/websocket/disconnect.go

deploy: ## Deploy backend to AWS Lambda
	sls deploy --verbose

remove: ## Remove backend from AWS Lambda
	sls remove --verbose
