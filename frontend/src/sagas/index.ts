import UserSagas from 'sagas/user'
import PlayersSagas from 'sagas/players'
import WebSocketSagas from 'sagas/websockets'

export default [
  UserSagas(),
  PlayersSagas(),
  WebSocketSagas()
]
