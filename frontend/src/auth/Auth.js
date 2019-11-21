import auth0 from 'auth0-js'
import { authConfig } from '../config/app'

const auth0Client = new auth0.WebAuth({
  domain: authConfig.domain,
  audience: authConfig.audience,
  clientID: authConfig.clientId,
  redirectUri: authConfig.callbackUrl,
  responseType: 'id_token',
  scope: 'openid profile email'
})

export function handleAuthentication() {
  return new Promise((resolve, reject) => {
    auth0Client.parseHash((err, authResult) => {
      if (err) return reject(err);
      if (!authResult || !authResult.idToken) {
        return reject(err);
      }
      const idToken = authResult.idToken;
      const profile = authResult.idTokenPayload;
      // set the time that the id token will expire at
      const expiresAt = authResult.idTokenPayload.exp * 1000;
      resolve({
        authenticated: true,
        idToken,
        profile,
        expiresAt
      })
    })
  })
}

export function login() {
  auth0Client.authorize()
}

export function logout() {
  auth0Client.logout({
    returnTo: 'http://localhost:3000',
    clientID: authConfig.clientId
  })
}
