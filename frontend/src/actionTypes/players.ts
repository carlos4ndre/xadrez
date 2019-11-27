import { Player } from 'types/player'
import { UserState } from 'types/state'

export const GET_PLAYERS_REQUEST  = 'GET_PLAYERS_REQUEST'
export const GET_PLAYERS_SUCCESS  = 'GET_PLAYERS_SUCCESS'
export const GET_PLAYERS_FAILURE  = 'GET_PLAYERS_FAILURE'

export interface GetPlayersRequest {
  type: typeof GET_PLAYERS_REQUEST,
  user: UserState
}

export interface GetPlayersSuccess {
  type: typeof GET_PLAYERS_SUCCESS,
  players: Player[]
}

export interface GetPlayersFailure {
  type: typeof GET_PLAYERS_FAILURE
}

export type PlayersActionTypes = GetPlayersRequest | GetPlayersSuccess | GetPlayersFailure
