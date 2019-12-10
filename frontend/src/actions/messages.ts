import * as types from 'actionTypes'
import { Game } from 'types/game'

export const sendMessage = (text: string, game: Game) => ({
  type: types.SEND_MESSAGE_REQUEST,
  text,
  game
})

export const sendMessageSuccess = () => ({
  type: types.SEND_MESSAGE_SUCCESS
})

export const sendMessageFailure = (error: string) => ({
  type: types.SEND_MESSAGE_FAILURE,
  error
})

export const receivedMessage = (text: string, game: Game) => ({
  type: types.RECEIVED_MESSAGE,
  text,
  game
})
