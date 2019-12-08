import { Player } from 'types/player'

export type GameModes = 'standard'

export type GameStatus = 'not_started' | 'started' | 'rejected' | 'draw' | 'white_wins' | 'black_wins'

export interface GameOptions {
  mode: GameModes,
  color: 'white' | 'black' | 'random',
  time: 'notime' | '5m' | '10m'
}

export interface Game {
  id: string,
  mode: GameModes,
  time: number,
  playerTurn: string,
  whitePlayerId: string,
  blackPlayerId: string,
  moves: string[],
  status: GameStatus
}

export interface Move {
  from: string,
  to: string
}

export interface GameMap {[key: string]: Game}
