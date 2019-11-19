import { LOGIN_USER_SUCCESS, LOGOUT_USER_SUCCESS, AuthActionTypes } from 'actionTypes'
import { AuthState } from 'types/state'
import { createBrowserHistory } from 'history'
import Auth0 from 'auth/Auth0'

const initialState = {
  isLoggedIn: false,
  auth0: new Auth0(createBrowserHistory())
}

const reducer = (state: AuthState = initialState, action: AuthActionTypes) => {
  switch (action.type) {
    case LOGIN_USER_SUCCESS:
      return loginUser(state)
    case LOGOUT_USER_SUCCESS:
      return logoutUser(state)
    default:
      return state
  }
}

const loginUser = (state: AuthState) => {
  return {
    ...state,
    isLoggedIn: true
  }
}

const logoutUser = (state: AuthState) => {
  return {
    ...state,
    isLoggedIn: false
  }
}

export default reducer
