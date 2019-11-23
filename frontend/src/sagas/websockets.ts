import { all, takeLatest, put } from 'redux-saga/effects'
import * as actions from 'actions'
import * as types from 'actionTypes'

const wsConnect = function*() {
  try {
    yield put(actions.wsConnectSuccess())
  } catch(e) {
    console.log(e)
    yield put(actions.wsConnectFailure('Failed to open ws connection'))
  }
}

const wsDisconnect = function*() {
  try {
    yield put(actions.wsDisconnectSuccess())
  } catch(e) {
    console.log(e)
    yield put(actions.wsDisconnectFailure('Failed to close ws connection'))
  }
}

function* wsSagas() {
  yield all([
    yield takeLatest(types.LOGIN_USER_SUCCESS, wsConnect),
    yield takeLatest(types.LOGOUT_USER_SUCCESS, wsDisconnect),
  ])
}

export default wsSagas
