export interface Player {
  id: string,
  name: string,
  email: string,
  nickname: string,
  picture: string,
  status: number
}

export enum PlayerStatus {
    ONLINE = 1,
    OFFLINE = 2
}

export interface PlayerMap {[key: string]: Player}
