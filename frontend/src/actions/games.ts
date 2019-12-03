import * as types from 'actionTypes'
import { Player } from 'types/player'
import { UserState } from 'types/state'
import { GameOptions } from 'types/game'

export const createGame = (user: UserState, challengee: Player, gameOptions: GameOptions) => ({
  type: types.CREATE_GAME_REQUEST,
  user,
  challengee,
  gameOptions
})

export const createGameSuccess = () => ({
  type: types.CREATE_GAME_SUCCESS
})

export const createGameFailure = (error: string) => ({
  type: types.CREATE_GAME_FAILURE,
  error
})
