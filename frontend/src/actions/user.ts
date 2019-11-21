import * as types from 'actionTypes'
import { UserState } from 'types/state'

export const loginUser = () => ({
  type: types.LOGIN_USER_REQUEST
})

export const loginUserCallback = () => ({
  type: types.LOGIN_USER_CALLBACK
})

export const loginUserSuccess = (user: UserState) => ({
  type: types.LOGIN_USER_SUCCESS,
  user
})

export const loginUserFailure = (error: string) => ({
  type: types.LOGIN_USER_FAILURE,
  error
})

export const logoutUser = () => ({
  type: types.LOGOUT_USER_REQUEST
})

export const logoutUserSuccess = () => ({
  type: types.LOGOUT_USER_SUCCESS
})

export const logoutUserFailure = (error: string) => ({
  type: types.LOGOUT_USER_FAILURE,
  error
})
