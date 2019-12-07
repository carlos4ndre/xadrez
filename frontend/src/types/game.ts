import { Player } from 'types/player'

export type GameModes = 'standard'

export type GameStatus = 'not_started' | 'started' | 'rejected' | 'aborted' | 'stalemate' | 'resign' | 'draw' | 'winner'

export type GameWinner =  'white' | 'black' | 'draw' | 'not_available'

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
  status: GameStatus,
  winner: GameWinner
}

export interface GameMap {[key: string]: Game}
