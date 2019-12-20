# Xadrez

Simple chess application written in Python using Auth0, AWS API Gateway, Lambda and DynamoDB.

## Motivation

This project is part of the Udacity Cloud Developer program, where we are supposed to apply some of the concept we've learned throughout the course.

I took this opportunity to build a chess game because despite its apperant simplicity it can bring very interesting design choices and exercise many aspects of the application design, development, testing and deployment. It goes without saying that I'm also a huge fan, although a terrible player!

This is not supposed to be a production ready application, but good enough such that it can be easy to play and develop.


## Features

* Authentication with Auth0
* Simple chess match with no time or predefined times of 1/5/10 minutes
* Choose starting color
* Resign game
* Real-time experience using WebSockets
* Highlight possible moves
* In game chat room

## Dependencies

* Auth0
* Amazon AWS
* Python 3.x
* Serverless Framework

## Setup

### Install Python 3

This application was developed on Python 3.7, so this is the recommended version (see [installation instructions](https://www.python.org/downloads/)).

### Install Yarn

See the [installation guide](https://yarnpkg.com/lang/en/docs/install/#debian-stable)

### Install Serverless Framework

See the [installation guide](https://serverless.com/framework/docs/providers/aws/guide/installation/).

### AWS CLI

In order to deploy your lambda functions and the website, serverless will require your AWS account credentials.
To achieve this, you can setup your AWS CLI on your local machine (see the [official documetation](https://docs.aws.amazon.com/polly/latest/dg/setup-aws-cli.html)).

### Auth0 Account

1. Create an account on Auth0 (free tier)
2. Create a regular web application
3. Copy your domain and Client ID for later use

### Backend

1. Go into the backend folder
2. Export your Auth0 settings
`$ export AUTH0_DOMAIN_ID="<Your Auth0 Domain ID>`
`$ export AUTH0_CLIENT_ID="<Your Auth0 Client ID>"`
3. Deploy your lambda functions to AWS
`$ make install`
`$ make deploy`
4. Save the Gateway API endpoints for both HTTP and WSS endpoints.

### Frontend

1. Go into the frontend folder
2. Using the information gathered from Auth0 and backend deployments, you should create the `.env` file with the following content:
```
# Auth0
REACT_APP_AUTH0_DOMAIN = 'my-app-domain.auth0.com'
REACT_APP_AUTH0_CLIENT_ID = 'my-client-id'
# AWS
REACT_APP_API_URL = 'https://234sdfds.execute-api.us-east-1.amazonaws.com/dev'
REACT_APP_WS_URL = 'wss://sadfasd3d.execute-api.us-east-1.amazonaws.com/dev'
REACT_APP_WEBSITE_URL = 'http://mywebsite'
```
3. Deploy the frontend
`$ make build`
`$ make deploy`
4. Once the deployment is done, you should receive an endpoint to where your website will be served, use that URL and add it to your your allowed Callback and Logout URLs settings in Auth0 (see Applications > settings).
5. You should now be all setup! Enjoy!

## Run it locally

### Auth0 Account

You can reuse the same tenant, otherwise [create a separate one](https://auth0.com/docs/dev-lifecycle/setting-up-env).

### Backend

1. Go into the backend folder
2. Export your Auth0 settings
`$ export AUTH0_DOMAIN_ID="<Your Auth0 Domain ID>`
`$ export AUTH0_CLIENT_ID="<Your Auth0 Client ID>"`
3. Start the API Gateway with both HTTP and Websocket endpoints in offline mode:
`$ make install`
`$ virtualenv -p /usr/bin/python3.7 venv`
`$ source venv/bin/activate`
`$ make dev`
4. Start the DynamoDB in offline mode:
`$ make dynamodb-offline`

### Frontend

1. Go into the frontend folder
2. Using the information gathered from Auth0 and backend deployments, you should create the `.env.development` file with the following content:
```
# Auth0
REACT_APP_AUTH0_DOMAIN = 'my-app-domain.auth0.com'
REACT_APP_AUTH0_CLIENT_ID = 'my-client-id'
# AWS
REACT_APP_API_URL = 'http://localhost:5000'
REACT_APP_WS_URL = 'ws://localhost:3001'
REACT_APP_WEBSITE_URL = 'http://localhost:3000'
```
3. Run your frontend locally
`$ make build`
`$ make dev`
It will be listening on http://localhost:3000
4. You should now be all setup! Enjoy!
