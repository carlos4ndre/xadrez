const apiId = '7798pmmh48'
const domain = 'dev-embzl7vs.auth0.com'
const clientId = 'brSV94G2uZANc2lmTtZYXUmci2pTdx1H'
const apiHostname = `${apiId}.execute-api.us-east-1.amazonaws.com`
const apiEnvironment = 'dev'
const websiteHostname = 'localhost:3000'

export const apiEndpoint = `https://${apiHostname}/${apiEnvironment}`
export const wsEndpoint = `wss://${apiHostname}/${apiEnvironment}`
export const authConfig: any = {
  domain,
  clientId,
  audience: `https://${domain}/userinfo`,
  callbackUrl: `http://${websiteHostname}/callback`
}
