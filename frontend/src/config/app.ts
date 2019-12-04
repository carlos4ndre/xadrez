// AWS
const env = 'dev'
const apiHostname = '20k0gk2v1h.execute-api.us-east-1.amazonaws.com'
const wsHostname = '52gfyx2n03.execute-api.us-east-1.amazonaws.com'
const websiteHostname = 'localhost:3000'
export const apiEndpoint = `https://${apiHostname}/${env}`
export const wsEndpoint = `wss://${wsHostname}/${env}`


// Auth0
const domain = 'dev-embzl7vs.auth0.com'
const clientId = 'brSV94G2uZANc2lmTtZYXUmci2pTdx1H'
export const authConfig: any = {
  domain,
  clientId,
  audience: `https://${domain}/userinfo`,
  callbackUrl: `http://${websiteHostname}/callback`
}
