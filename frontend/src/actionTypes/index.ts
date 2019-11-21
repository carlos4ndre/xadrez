import { UserState } from 'types/state'

// User
export const LOGIN_USER_REQUEST  = 'LOGIN_USER_REQUEST'
export const LOGIN_USER_CALLBACK = 'LOGIN_USER_CALLBACK'
export const LOGIN_USER_SUCCESS  = 'LOGIN_USER_SUCCESS'
export const LOGIN_USER_FAILURE  = 'LOGIN_USER_FAILURE'

export const LOGOUT_USER_REQUEST = 'LOGOUT_USER_REQUEST'
export const LOGOUT_USER_SUCCESS = 'LOGOUT_USER_SUCCESS'
export const LOGOUT_USER_FAILURE = 'LOGOUT_USER_FAILURE'

export interface LoginUserRequest {
  type: typeof LOGIN_USER_REQUEST
}

export interface LoginUserCallback {
  type: typeof LOGIN_USER_CALLBACK
}

export interface LoginUserSuccess {
  type: typeof LOGIN_USER_SUCCESS,
  user: UserState
}

export interface LoginUserFailure {
  type: typeof LOGIN_USER_FAILURE
}

export interface LogoutUserRequest {
  type: typeof LOGOUT_USER_REQUEST
}

export interface LogoutUserSuccess {
  type: typeof LOGOUT_USER_SUCCESS
}

export interface LogoutUserFailure {
  type: typeof LOGOUT_USER_FAILURE
}

export type UserActionTypes = LoginUserRequest | LoginUserCallback | LoginUserSuccess | LoginUserFailure | LogoutUserRequest | LogoutUserSuccess | LogoutUserFailure
