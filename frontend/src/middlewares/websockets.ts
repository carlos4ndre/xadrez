import { wsEndpoint } from '../config/app'
import * as actions from 'actions'
import * as types from 'actionTypes'

const emitEvent = (socket: WebSocket|undefined, action: any, content: object) => {
  try {
    if (!socket) {
      console.error('The socket is not initialized')
      return
    }

    socket.send(JSON.stringify({
      'action': action,
      'content': content
    }))
  } catch(error) {
    console.error(`Failed to emit event for action ${action}: ${error}`)
  }
}

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
      case 'movePieceSuccess':
        store.dispatch(actions.movePieceSuccess(content.game))
        break
      case 'movePieceFailure':
        store.dispatch(actions.movePieceFailure(content.error))
        break
      case 'endGame':
        store.dispatch(actions.endGame(content.game))
        break
      case 'sendMessage':
        store.dispatch(actions.receivedMessage(content.message))
        break
      default:
        break
    }
  }

  // the middleware part of this function
  return (store: any) => (next: any) => (action: any) => {
    switch (action.type) {
      case types.WS_CONNECT_REQUEST:
        if (socket) {socket.close()}

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
          console.log('websocket closed')
        }
        break
      case types.CREATE_GAME_REQUEST:
        emitEvent(socket, 'createGame', {
            'challengeeId': action.challengee.id,
            'gameOptions': action.gameOptions
        })
        break
      case types.ACCEPT_GAME:
        emitEvent(socket, 'acceptGame', {'game': action.game})
        break
      case types.REJECT_GAME:
        emitEvent(socket, 'rejectGame', {'game': action.game})
        break
      case types.MOVE_PIECE_REQUEST:
        emitEvent(socket, 'movePiece', {'move': action.move, 'game': action.game})
        break
      case types.LEAVE_GAME_REQUEST:
        emitEvent(socket, 'leaveGame', {'game': action.game})
        break
      case types.SEND_MESSAGE_REQUEST:
        emitEvent(socket, 'sendMessage', {'text': action.text, 'game': action.game})
        break
      default:
        console.log('the next action:', action)
        return next(action)
    }
  }
}

export default socketMiddleware()
