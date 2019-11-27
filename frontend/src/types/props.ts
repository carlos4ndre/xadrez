import { UserState } from 'types/state'
import { History } from 'history'
import { Player } from 'types/player'

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

export interface ProfileProps {
  user: UserState
}

export interface CallbackProps {
  user: UserState,
  loginUserCallback: () => void
}

export interface PlayersProps {
  players: Player[]
}
