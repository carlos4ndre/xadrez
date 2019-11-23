import UserSagas from 'sagas/user'
import WebSocketSagas from 'sagas/websockets'

export default [
  UserSagas(),
  WebSocketSagas()
]
