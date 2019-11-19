import { History } from 'history'
import { MouseEvent } from 'react'
import { MenuItemProps } from 'semantic-ui-react'
import Auth0 from 'auth/Auth0'

export interface AppProps {
  auth0: Auth0,
  history: History,
  isLoggedIn: boolean,
  loginUser: (auth0: Auth0) => void,
  loginUserCallback: (auth0: Auth0) => void,
  logoutUser: (auth0: Auth0) => void
}

export interface HeaderProps {
  isLoggedIn: boolean,
  onLogin: ((event: MouseEvent<HTMLAnchorElement>, data: MenuItemProps) => void) | undefined,
  onLogout: ((event: MouseEvent<HTMLAnchorElement>, data: MenuItemProps) => void) | undefined
}
