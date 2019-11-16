package main

import (
  "fmt"
  "net/http"
  "github.com/aws/aws-lambda-go/events"
  "github.com/aws/aws-lambda-go/lambda"
)

func Handler(request events.APIGatewayWebsocketProxyRequest) (events.APIGatewayProxyResponse, error) {
  ctx := request.RequestContext
  fmt.Printf("Disconnect client: connectionID=%s", ctx.ConnectionID)

  return events.APIGatewayProxyResponse{StatusCode: http.StatusOK}, nil
}

func main() {
  lambda.Start(Handler)
}
