import { wsConnectSuccess, wsDisconnectSuccess } from 'actions'
import { wsEndpoint } from '../config/app'
import { WS_CONNECT_REQUEST, WS_DISCONNECT_REQUEST, CREATE_GAME_REQUEST } from 'actionTypes'

const socketMiddleware = () => {
  let socket: (WebSocket|undefined) = undefined

  const onOpen = (store: any) => (event: any) => {
    console.log('websocket open', event.target.url)
    store.dispatch(wsConnectSuccess())
  }

  const onClose = (store: any) => () => {
    store.dispatch(wsDisconnectSuccess())
  }

  const onMessage = (store: any) => (event: any) => {
    const payload = JSON.parse(event.data)
    console.log('receiving server message')

    switch (payload.type) {
      default:
        break
    }
  }

  // the middleware part of this function
  return (store: any) => (next: any) => (action: any) => {
    switch (action.type) {
      case WS_CONNECT_REQUEST:
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
      case WS_DISCONNECT_REQUEST:
        if (socket) {
          socket.close()
        }
        console.log('websocket closed')
        break
      case CREATE_GAME_REQUEST:
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
      default:
        console.log('the next action:', action)
        return next(action)
    }
  }
}

export default socketMiddleware()
