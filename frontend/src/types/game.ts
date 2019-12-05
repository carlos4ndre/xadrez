import { Player } from 'types/player'

export type GameModes = 'standard'

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
  status: 'not_started' | 'started' | 'aborted' | 'stalemate' | 'resign' | 'draw' | 'winner';
  winner: 'white' | 'black' | 'draw' | 'not_available';
}
