import { Auth0UserProfile } from 'auth0-js'

export interface UserState {
  authenticated: boolean,
  idToken: string,
  expiresAt: string,
  profile: Auth0UserProfile
}

export interface AppState {
  user: UserState
}
