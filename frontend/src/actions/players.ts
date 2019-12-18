import * as types from 'actionTypes'
import { Player } from 'types/player'
import { UserState } from 'types/state'

export const getPlayers = (user: UserState) => ({
  type: types.GET_PLAYERS_REQUEST,
  user
})

export const getPlayersSuccess = (players: Player[]) => ({
  type: types.GET_PLAYERS_SUCCESS,
  players
})

export const getPlayersFailure = (error: string) => ({
  type: types.GET_PLAYERS_FAILURE,
  error
})

export const addPlayer = (player: Player) => ({
  type: types.ADD_PLAYER,
  player
})
