import { wsEndpoint } from '../config/app'
import * as actions from 'actions'
import * as types from 'actionTypes'

const socketMiddleware = () => {
  let socket: (WebSocket|undefined) = undefined

  const onOpen = (store: any) => (event: any) => {
    console.log('websocket open', event.target.url)
    store.dispatch(actions.wsConnectSuccess())
  }

  const onClose = (store: any) => () => {
    store.dispatch(actions.wsDisconnectSuccess())
  }

  const onMessage = (store: any) => (event: any) => {
    console.log('receiving server message')
    const { action, content } = JSON.parse(event.data)
    switch (action) {
      case 'createGame':
        store.dispatch(actions.createGameQuestion(content.challenger, content.game))
        break
      case 'startGame':
        store.dispatch(actions.startGame(content.game))
        break
      case 'endGame':
        store.dispatch(actions.endGame(content.game))
        break
      default:
        break
    }
  }

  // the middleware part of this function
  return (store: any) => (next: any) => (action: any) => {
    switch (action.type) {
      case types.WS_CONNECT_REQUEST:
        if (socket) {
          socket.close()
        }

        // connect to the remote host
        const wsUrl = `${wsEndpoint}/?token=${action.jwtToken}`
        socket = new WebSocket(wsUrl)
        console.log('Connected to ', wsEndpoint)

        // websocket handlers
        socket.onmessage = onMessage(store)
        socket.onclose = onClose(store)
        socket.onopen = onOpen(store)
        break
      case types.WS_DISCONNECT_REQUEST:
        if (socket) {
          socket.close()
        }
        console.log('websocket closed')
        break
      case types.CREATE_GAME_REQUEST:
        if (socket) {
          const data = {
            "action": "createGame",
            "content": {
              "challengee_id": action.challengee.id,
              "gameOptions": action.gameOptions
            }
          }
          socket.send(JSON.stringify(data));
        }
        break
      case types.ACCEPT_GAME:
        if (socket) {
          const data = {
            "action": "acceptGame",
            "content": {"game": action.game}
          }
          socket.send(JSON.stringify(data));
        }
        break
      case types.REJECT_GAME:
        if (socket) {
          const data = {
            "action": "rejectGame",
            "content": {"game": action.game}
          }
          socket.send(JSON.stringify(data));
        }
        break
      default:
        console.log('the next action:', action)
        return next(action)
    }
  }
}

export default socketMiddleware()
