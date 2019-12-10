import * as types from 'actionTypes'
import { UserState } from 'types/state'

const initialState = {
  authenticated: false,
  idToken: '',
  expiresAt: '',
  profile: {
    email: '',
    email_verified: false,
    family_name: '',
    gender: '',
    given_name: '',
    locale: '',
    name: '',
    nickname: '',
    picture: '',
    user_id: '',
    clientID: '',
    identities: [],
    created_at: '',
    updated_at: '',
    sub: ''
  }
}

const reducer = (state: UserState = initialState, action: types.UserActionTypes) => {
  switch (action.type) {
    case types.LOGIN_USER_SUCCESS:
      return loginUser(state, action.user)
    case types.LOGOUT_USER_SUCCESS:
      return logoutUser(state)
    default:
      return state
  }
}

const loginUser = (state: UserState, user: UserState) => {
  return {
    ...state,
    ...user,
    authenticated: true
  }
}

const logoutUser = (state: UserState) => {
  return {
    ...state,
    authenticated: false
  }
}

export default reducer
