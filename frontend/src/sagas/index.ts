import UserSagas from 'sagas/user'
import PlayersSagas from 'sagas/players'
import GamesSagas from 'sagas/games'
import WebSocketSagas from 'sagas/websockets'

export default [
  UserSagas(),
  PlayersSagas(),
  GamesSagas(),
  WebSocketSagas()
]
