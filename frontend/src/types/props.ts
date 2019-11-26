import { UserState } from 'types/state'
import { History } from 'history';

export interface HeaderProps {
  user: UserState,
  history: History,
  loginUser: () => void,
  logoutUser: () => void
}

export interface ProfileProps {
  user: UserState
}

export interface CallbackProps {
  user: UserState,
  loginUserCallback: () => void
}
