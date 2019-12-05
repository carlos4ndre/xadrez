import { Player } from 'types/player'

export type GameModes = 'standard'

export type GameStatus = 'not_started' | 'started' | 'rejected' | 'aborted' | 'stalemate' | 'resign' | 'draw' | 'winner'

export type GameWinner =  'white' | 'black' | 'draw' | 'not_available'

export interface GameOptions {
  mode: GameModes;
  color: 'white' | 'black' | 'random';
  time: 'notime' | '5m' | '10m';
}

export interface Game {
  id: string;
  mode: GameModes;
  player_turn: string;
  whitePlayer: Player;
  blackPlayer: Player;
  moves: string[];
  status: GameStatus;
  winner: GameWinner;
}
