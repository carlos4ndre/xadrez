import { Player } from 'types/player'
import { UserState } from 'types/state'
import { GameOptions } from 'types/game'

export const CREATE_GAME_REQUEST  = 'CREATE_GAME_REQUEST'
export const CREATE_GAME_SUCCESS  = 'CREATE_GAME_SUCCESS'
export const CREATE_GAME_FAILURE  = 'CREATE_GAME_FAILURE'

export interface CreateGameRequest {
  type: typeof CREATE_GAME_REQUEST,
  user: UserState,
  challengee: Player,
  gameOptions: GameOptions
}

export interface CreateGameSuccess {
  type: typeof CREATE_GAME_SUCCESS
}

export interface CreateGameFailure {
  type: typeof CREATE_GAME_FAILURE
}

export type GamesActionTypes = CreateGameRequest | CreateGameSuccess | CreateGameFailure
