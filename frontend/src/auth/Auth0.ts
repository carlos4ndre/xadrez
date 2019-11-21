import { WebAuth, Auth0DecodedHash } from 'auth0-js'
import { History } from 'history'
import { authConfig } from '../config/app'

export default class Auth0 {
  accessToken!: string
  idToken!: string
  expiresAt!: number
  history!: History

  auth0 = new WebAuth({
    domain: authConfig.domain,
    clientID: authConfig.clientId,
    redirectUri: authConfig.callbackUrl,
    responseType: 'token id_token',
    scope: 'openid'
  })

  constructor(history: History) {
    this.history = history

    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
    this.handleAuthentication = this.handleAuthentication.bind(this)
    this.isAuthenticated = this.isAuthenticated.bind(this)
    this.getAccessToken = this.getAccessToken.bind(this)
    this.getIdToken = this.getIdToken.bind(this)
    this.renewSession = this.renewSession.bind(this)
  }

  login(): void {
    this.auth0.authorize()
  }

  handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        console.log('Access token: ', authResult.accessToken)
        console.log('id token: ', authResult.idToken)
        this.setSession(authResult)
        this.history.replace('/')
      } else if (err) {
        this.history.replace('/')
        console.log(err)
        alert(`Error: ${err.error}. Check the console for further details.`)
      }
    })
  }

  getAccessToken(): string {
    return this.accessToken
  }

  getIdToken(): string {
    return this.idToken
  }

  setSession(authResult: Auth0DecodedHash): void {
    if (!authResult.expiresIn || !authResult.accessToken || !authResult.idToken) {
      console.log("Missing auth information from response payload")
      return
    }

    // Set the time that the access token will expire at
    let expiresAt = (authResult.expiresIn * 1000) + new Date().getTime()
    this.accessToken = authResult.accessToken
    this.idToken = authResult.idToken
    this.expiresAt = expiresAt

    // navigate to the home route
    this.history.replace('/')
  }

  renewSession(): void {
    this.auth0.checkSession({}, (err, authResult) => {
       if (authResult && authResult.accessToken && authResult.idToken) {
         this.setSession(authResult)
       } else if (err) {
         this.logout()
         console.log(err)
         alert(`Could not get a new token (${err.error}: ${err.error_description}).`)
       }
    });
  }

  logout(): void {
    // Remove tokens and expiry time
    this.accessToken = ""
    this.idToken = ""
    this.expiresAt = 0

    this.auth0.logout({
      returnTo: window.location.origin
    })

    // navigate to the home route
    this.history.replace('/')
  }

  isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    let expiresAt = this.expiresAt
    return new Date().getTime() < expiresAt
  }
}
