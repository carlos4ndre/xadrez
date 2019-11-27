export interface Player {
  id: string,
  name: string,
  nickname: string,
  picture: string
}

export interface PlayerMap {[key: string]: Player}
