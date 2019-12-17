import { Player } from 'types/player'

export type GameModes = 'standard'

export type GameStatus = 'not_started' | 'started' | 'rejected' | 'resigned' | 'checkmate' | 'insufficient_material' | 'seventy_five_moves' | 'five_fold_repetition' | 'out_of_time'

export type GameResult = 'white_wins' | 'black_wins' | 'draw' | 'undetermined'

export interface GameOptions {
  mode: GameModes
  color: 'white' | 'black' | 'random'
  time: 'notime' | '1m' | '5m' | '10m'
}

export interface Game {
  id: string
  mode: GameModes
  time: number
  whitePlayerTimeLeft: number
  blackPlayerTimeLeft: number
  playerTurn: string
  whitePlayerId: string
  blackPlayerId: string
  moves: string[]
  status: GameStatus
  result: GameResult
}

export interface Move {
  from: string
  to: string
}

export interface GameMap {[key: string]: Game}
