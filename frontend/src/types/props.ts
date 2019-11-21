import { UserState } from 'types/state'

export interface HeaderProps {
  user: UserState,
  loginUser: () => void,
  logoutUser: () => void
}

export interface CallbackProps {
  user: UserState,
  loginUserCallback: () => void
}
