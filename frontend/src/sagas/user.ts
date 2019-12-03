import { all, takeLatest, call, put } from 'redux-saga/effects'
import * as actions from 'actions'
import * as types from 'actionTypes'
import { login, logout, handleAuthentication } from '../auth/Auth'
import { toast } from "react-toastify";

const loginUser = function*() {
  try {
    yield call(login)
  } catch(e) {
    console.log(e)
    yield put(actions.loginUserFailure('Failed to redirect user'))
  }
}

const loginUserSuccess = function*() {
  yield call(toast.success, 'Login successful')
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

const loginUserFailure = function*() {
  yield call(toast.error, 'Login failed')
}

const logoutUser = function*() {
  try {
    yield call(logout)
    yield put(actions.logoutUserSuccess())
  } catch(e) {
    yield put(actions.logoutUserFailure("Failed to logout user"))
  }
}

const logoutUserSuccess = function*() {
  yield call(toast.success, 'Logout successful')
}

const logoutUserFailure = function*() {
  yield call(toast.error, 'Logout failed')
}

function* userSagas() {
  yield all([
    yield takeLatest(types.LOGIN_USER_REQUEST, loginUser),
    yield takeLatest(types.LOGIN_USER_CALLBACK, loginUserCallback),
    yield takeLatest(types.LOGIN_USER_SUCCESS, loginUserSuccess),
    yield takeLatest(types.LOGIN_USER_FAILURE, loginUserFailure),
    yield takeLatest(types.LOGOUT_USER_REQUEST, logoutUser),
    yield takeLatest(types.LOGOUT_USER_SUCCESS, logoutUserSuccess),
    yield takeLatest(types.LOGOUT_USER_FAILURE, logoutUserFailure)
  ])
}

export default userSagas
