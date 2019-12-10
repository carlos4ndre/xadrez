import { Game } from 'types/game'

export const SEND_MESSAGE_REQUEST  = 'SEND_MESSAGE_REQUEST'
export const SEND_MESSAGE_SUCCESS  = 'SEND_MESSAGE_SUCCESS'
export const SEND_MESSAGE_FAILURE  = 'SEND_MESSAGE_FAILURE'

export const RECEIVED_MESSAGE  = 'RECEIVED_MESSAGE'

export interface SendMessageRequest {
  type: typeof SEND_MESSAGE_REQUEST,
  text: string,
  game: Game
}

export interface SendMessageSuccess {
  type: typeof SEND_MESSAGE_SUCCESS
}

export interface SendMessageFailure {
  type: typeof SEND_MESSAGE_FAILURE,
  error: string
}

export interface ReceivedMessage {
  type: typeof RECEIVED_MESSAGE,
  text: string,
  game: Game
}

export type MessagesActionTypes =
  SendMessageRequest |
  SendMessageSuccess |
  SendMessageFailure |
  ReceivedMessage
