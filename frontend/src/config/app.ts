// AWS
export const apiEndpoint = process.env.REACT_APP_API_URL
export const wsEndpoint = process.env.REACT_APP_WS_URL
export const websiteEndpoint = process.env.REACT_APP_WEBSITE_URL

// Auth0
const domain = process.env.REACT_APP_AUTH0_DOMAIN
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID
export const authConfig: any = {
  domain,
  clientId,
  audience: `https://${domain}/userinfo`,
  callbackUrl: `${websiteEndpoint}/callback`
}
