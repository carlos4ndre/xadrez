import { Auth0UserProfile } from 'auth0-js'
import { PlayerMap } from 'types/player'
import { GameMap } from 'types/game'
import { ChatRoomMap, Message } from 'types/chatroom'

export interface AppState {
  user: UserState,
  players: PlayersState,
  games: GamesState,
  chatRooms: ChatRoomsState
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


export interface GamesState {
  byId: GameMap,
  allIds: string[],
  isFetching: boolean
}

export interface ChatRoomsState {
  byId: ChatRoomMap,
  allIds: string[],
  isFetching: boolean
}

export interface ChatRoomState {
  text: string
}
