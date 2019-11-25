import * as types from 'actionTypes'

export const wsConnect = (jwtToken: string) => ({
  type: types.WS_CONNECT_REQUEST,
  jwtToken
})

export const wsConnectSuccess = () => ({
  type: types.WS_CONNECT_SUCCESS
})

export const wsConnectFailure = (error: string) => ({
  type: types.WS_CONNECT_FAILURE,
  error
})

export const wsDisconnect = () => ({
  type: types.WS_DISCONNECT_REQUEST
})

export const wsDisconnectSuccess = () => ({
  type: types.WS_DISCONNECT_SUCCESS
})

export const wsDisconnectFailure = (error: string) => ({
  type: types.WS_DISCONNECT_FAILURE,
  error
})
