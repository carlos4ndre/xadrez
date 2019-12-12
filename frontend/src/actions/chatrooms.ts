import * as types from 'actionTypes'
import { Game } from 'types/game'
import { Message } from 'types/chatroom'

export const sendMessage = (text: string, game: Game) => ({
  type: types.SEND_MESSAGE_REQUEST,
  text,
  game
})

export const receivedMessage = (message: Message) => ({
  type: types.RECEIVED_MESSAGE,
  message
})
