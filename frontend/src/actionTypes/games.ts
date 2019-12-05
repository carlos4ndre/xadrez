import { Player } from 'types/player'
import { UserState } from 'types/state'
import { Game, GameOptions } from 'types/game'

export const CREATE_GAME_REQUEST  = 'CREATE_GAME_REQUEST'
export const CREATE_GAME_QUESTION = 'CREATE_GAME_QUESTION'
export const CREATE_GAME_SUCCESS  = 'CREATE_GAME_SUCCESS'
export const CREATE_GAME_FAILURE  = 'CREATE_GAME_FAILURE'

export const ACCEPT_GAME  = 'ACCEPT_GAME'
export const REJECT_GAME  = 'REJECT_GAME'
export const END_GAME  = 'END_GAME'

export interface CreateGameRequest {
  type: typeof CREATE_GAME_REQUEST,
  user: UserState,
  challengee: Player,
  gameOptions: GameOptions
}

export interface CreateGameQuestion {
  type: typeof CREATE_GAME_QUESTION,
  challenger: Player,
  game: Game
}

export interface CreateGameSuccess {
  type: typeof CREATE_GAME_SUCCESS,
  game: Game
}

export interface CreateGameFailure {
  type: typeof CREATE_GAME_FAILURE
}

export interface AcceptGame {
  type: typeof ACCEPT_GAME,
  game: Game
}

export interface RejectGame {
  type: typeof REJECT_GAME,
  game: Game
}

export interface EndGame {
  type: typeof END_GAME,
  game: Game
}

export type GamesActionTypes =
  CreateGameRequest |
  CreateGameSuccess |
  CreateGameFailure |
  CreateGameQuestion |
  AcceptGame |
  RejectGame |
  EndGame
