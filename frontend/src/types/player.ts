export interface Player {
  id: string,
  name: string,
  email: string,
  nickname: string,
  picture: string
}

export interface PlayerMap {[key: string]: Player}
