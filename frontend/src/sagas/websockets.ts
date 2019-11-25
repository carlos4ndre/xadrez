import { all, takeLatest, put } from 'redux-saga/effects'
import * as actions from 'actions'
import * as types from 'actionTypes'

const wsConnect = function*(action: types.LoginUserSuccess) {
  if (action.user.idToken) {
    yield put(actions.wsConnect(action.user.idToken))
  }
  else {
    yield put(actions.wsConnectFailure("Missing user idToken"))
  }
}

const wsDisconnect = function*() {
  yield put(actions.wsDisconnect())
}

function* wsSagas() {
  yield all([
    yield takeLatest(types.LOGIN_USER_SUCCESS, wsConnect),
    yield takeLatest(types.LOGOUT_USER_SUCCESS, wsDisconnect),
  ])
}

export default wsSagas
