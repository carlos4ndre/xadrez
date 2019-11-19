import * as types from 'actionTypes'
import Auth0 from 'auth/Auth0'

export const loginUser = (auth0: Auth0) => ({
  type: types.LOGIN_USER_REQUEST,
  auth0
})

export const loginUserCallback = (auth0: Auth0) => ({
  type: types.LOGIN_USER_CALLBACK,
  auth0
})

export const loginUserSuccess = () => ({
  type: types.LOGIN_USER_SUCCESS
})

export const loginUserFailure = (error: string) => ({
  type: types.LOGIN_USER_FAILURE,
  error
})

export const logoutUser = (auth0: Auth0) => ({
  type: types.LOGOUT_USER_REQUEST,
  auth0
})

export const logoutUserSuccess = () => ({
  type: types.LOGOUT_USER_SUCCESS
})

export const logoutUserFailure = (error: string) => ({
  type: types.LOGOUT_USER_FAILURE,
  error
})
