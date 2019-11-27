import { Auth0UserProfile } from 'auth0-js'
import { PlayerMap } from 'types/player'

export interface AppState {
  user: UserState,
  players: PlayersState
}

export interface UserState {
  authenticated: boolean,
  idToken: string,
  expiresAt: string,
  profile: Auth0UserProfile
}

export interface PlayersState {
  byId: PlayerMap,
  allIds: string[],
  isFetching: boolean
}
