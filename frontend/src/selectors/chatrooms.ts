import { createSelector } from 'reselect'
import { AppState } from 'types/state'

export const chatRooms = (state: AppState) => state.chatRooms
export const roomId = (state: AppState, id: string) => id

export const getChatRooms = createSelector(
  chatRooms,
  (chatRooms) => Object.values(chatRooms.byId)
)

export const getChatRoom = createSelector(
  [ chatRooms, roomId ],
  (chatRooms, id) => chatRooms.byId[id]
)
