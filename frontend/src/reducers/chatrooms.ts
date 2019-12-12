import _ from 'lodash'
import * as types from 'actionTypes'
import { ChatRoomsState } from 'types/state'
import { Message } from 'types/chatroom'

const initialState = {
  byId: {},
  allIds: [],
  isFetching: false
}

const reducer = (state: ChatRoomsState = initialState, action: types.MessagesActionTypes) => {
  switch (action.type) {
    case types.RECEIVED_MESSAGE:
      return addMessage(state, action.message)
    default:
      return state
  }
}


const addMessage = (state: ChatRoomsState, message: Message) => {
  const room_id = message.room_id
  const chatRoom = state.byId[room_id] || {"messages": []}

  return {
    ...state,
    byId: {
      ...state.byId,
      [room_id]: {
        ...chatRoom,
        messages: chatRoom.messages.concat(message)
      }
    },
    allIds: _.uniq(state.allIds.concat(room_id))
  }
}

export default reducer
