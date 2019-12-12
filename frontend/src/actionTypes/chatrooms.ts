import { Game } from 'types/game'
import { Message } from 'types/chatroom'

export const SEND_MESSAGE_REQUEST  = 'SEND_MESSAGE_REQUEST'
export const RECEIVED_MESSAGE  = 'RECEIVED_MESSAGE'

export interface SendMessageRequest {
  type: typeof SEND_MESSAGE_REQUEST,
  text: string,
  game: Game
}

export interface ReceivedMessage {
  type: typeof RECEIVED_MESSAGE,
  message: Message
}

export type MessagesActionTypes =
  SendMessageRequest |
  ReceivedMessage
