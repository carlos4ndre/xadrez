export const WS_CONNECT_REQUEST  = 'WS_CONNECT_REQUEST'
export const WS_CONNECT_SUCCESS  = 'WS_CONNECT_SUCCESS'
export const WS_CONNECT_FAILURE  = 'WS_CONNECT_FAILURE'

export const WS_DISCONNECT_REQUEST = 'WS_DISCONNECT_REQUEST'
export const WS_DISCONNECT_SUCCESS = 'WS_DISCONNECT_SUCCESS'
export const WS_DISCONNECT_FAILURE = 'WS_DISCONNECT_FAILURE'

export interface WsConnectRequest {
  type: typeof WS_CONNECT_REQUEST,
  jwtToken: string
}

export interface WsConnectSuccess {
  type: typeof WS_CONNECT_SUCCESS
}

export interface WsConnectFailure {
  type: typeof WS_CONNECT_FAILURE
}

export interface WsDisconnectRequest {
  type: typeof WS_DISCONNECT_REQUEST
}

export interface WsDisconnectSuccess {
  type: typeof WS_DISCONNECT_SUCCESS
}

export interface WsDisconnectFailure {
  type: typeof WS_DISCONNECT_FAILURE
}

export type WsActionTypes =
  WsConnectRequest |
  WsConnectSuccess |
  WsConnectFailure |
  WsDisconnectRequest |
  WsDisconnectSuccess |
  WsDisconnectFailure
