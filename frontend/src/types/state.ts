import Auth0 from 'auth/Auth0'

export interface AppState {
  auth: AuthState
}

export interface AuthState {
  isLoggedIn: boolean,
  auth0: Auth0
}
