import * as types from 'actionTypes'
import { Player } from 'types/player'
import { UserState } from 'types/state'
import { Game, GameOptions } from 'types/game'

export const createGame = (user: UserState, challengee: Player, gameOptions: GameOptions) => ({
  type: types.CREATE_GAME_REQUEST,
  user,
  challengee,
  gameOptions
})

export const createGameQuestion = (challenger: Player, game: Game) => ({
  type: types.CREATE_GAME_QUESTION,
  challenger,
  game
})

export const createGameSuccess = (game: Game) => ({
  type: types.CREATE_GAME_SUCCESS,
  game
})

export const createGameFailure = (error: string) => ({
  type: types.CREATE_GAME_FAILURE,
  error
})

export const acceptGame = (game: Game) => ({
  type: types.ACCEPT_GAME,
  game
})

export const rejectGame = (game: Game) => ({
  type: types.REJECT_GAME,
  game
})
