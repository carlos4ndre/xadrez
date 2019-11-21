import { all, takeLatest, call, put } from 'redux-saga/effects'
import * as actions from 'actions'
import * as types from 'actionTypes'

const loginUser = function*(action: types.LoginUserRequest) {
  try {
    yield call(action.auth0.login)
  } catch(e) {
    yield put(actions.loginUserFailure("Failed to redirect to auth0"))
  }
}

const loginUserCallback = function*(action: types.LoginUserCallback) {
  try {
    const location = window.location
    if (/access_token|id_token|error/.test(location.hash)) {
      yield call(action.auth0.handleAuthentication)
      yield put(actions.loginUserSuccess())
    } else {
      yield put(actions.loginUserFailure("Failed to process auth0 callback"))
    }
  } catch(e) {
    yield put(actions.loginUserFailure("Failed to process auth0 callback"))
  }
}

const logoutUser = function*(action: types.LogoutUserRequest) {
  try {
    yield call(action.auth0.logout)
    yield put(actions.logoutUserSuccess())
  } catch(e) {
    yield put(actions.logoutUserFailure("Failed to logout user"))
  }
}

function* authSagas() {
  yield all([
    yield takeLatest(types.LOGIN_USER_REQUEST, loginUser),
    yield takeLatest(types.LOGIN_USER_CALLBACK, loginUserCallback),
    yield takeLatest(types.LOGOUT_USER_REQUEST, logoutUser),
  ])
}

export default authSagas
