import { UserState } from 'types/state'
import { Game, GameOptions } from 'types/game'
import { History } from 'history'
import { Player } from 'types/player'
import Chess from "chess.js"

export interface HeaderProps {
  user: UserState,
  history: History,
  loginUser: () => void,
  logoutUser: () => void
}

export interface HomeProps {
  user: UserState,
  players: Player[],
  getPlayers: (user: UserState) => void
}

export interface GameChallengeInfoProps {
  game: Game,
  player: Player
}

export interface GameProps {
  game: Game,
  whitePlayer: Player,
  blackPlayer: Player,
  color: string
}

export interface ProfileProps {
  user: UserState
}

export interface CallbackProps {
  user: UserState,
  loginUserCallback: () => void
}

export interface PlayerIconProps {
  player: Player
}

export interface PlayersProps {
  players: Player[]
}

export interface CreateGameFormProps {
  user: UserState,
  player: Player,
  submitErrors: object,
  children: object,
  createGame: (user: UserState, challengee: Player, gameOptions: GameOptions) => void
}

export interface CreateGameQuestionProps {
  game: Game,
  challenger: Player,
  closeToast?: () => void,
  acceptGame: (game: Game) => void,
  rejectGame: (game: Game) => void
}

export interface LeaveGameFormProps {
  game: Game,
  submitErrors: object,
  children: object,
  leaveGame: (game: Game) => void
}

export interface ChessBoardProps {
  orientation: 'white' | 'black',
  game: any
}
