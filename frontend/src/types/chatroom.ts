export interface Author {
  id: string,
  name: string,
  picture: string
}


export interface Message {
  id: string,
  room_id: string,
  author: Author,
  text: string,
  created_at: string
}

export interface ChatRoom {
  messages: Message[]
}


export interface ChatRoomMap {[key: string]: ChatRoom}
