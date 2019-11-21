const apiId = 'idbps2dgcc'

export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig: any = {
  domain: 'dev-embzl7vs.auth0.com',
  clientId: 'brSV94G2uZANc2lmTtZYXUmci2pTdx1H',
  audience: 'https://dev-embzl7vs.auth0.com/userinfo',
  callbackUrl: 'http://localhost:3000/callback'
}
