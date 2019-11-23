import { all, takeLatest, call, put } from 'redux-saga/effects'
import * as actions from 'actions'
import * as types from 'actionTypes'
import { login, logout, handleAuthentication } from '../auth/Auth'

const loginUser = function*() {
  try {
    yield call(login)
  } catch(e) {
    console.log(e)
    yield put(actions.loginUserFailure('Failed to redirect user'))
  }
}

const loginUserCallback = function*() {
  try {
    const user = yield call(handleAuthentication)
    yield put(actions.loginUserSuccess(user))
  } catch(e) {
    console.log(e)
    yield put(actions.loginUserFailure("Failed to handle login callback"))
  }
}

const logoutUser = function*() {
  try {
    yield call(logout)
    yield put(actions.logoutUserSuccess())
  } catch(e) {
    yield put(actions.logoutUserFailure("Failed to logout user"))
  }
}

function* userSagas() {
  yield all([
    yield takeLatest(types.LOGIN_USER_REQUEST, loginUser),
    yield takeLatest(types.LOGIN_USER_CALLBACK, loginUserCallback),
    yield takeLatest(types.LOGOUT_USER_REQUEST, logoutUser),
  ])
}

export default userSagas
