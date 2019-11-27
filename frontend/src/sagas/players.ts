import { all, takeLatest, call, put } from 'redux-saga/effects'
import * as actions from 'actions'
import * as api from 'utils/api'
import * as types from 'actionTypes'

const getPlayers = function*(action: types.GetPlayersRequest) {
  try {
    const response = yield call(api.getPlayers, action.user.idToken)
    const result = yield response.json()
    const error = result.error

    if (error) {
      yield put(actions.getPlayersFailure(error))
    } else {
      yield put(actions.getPlayersSuccess(result.players))
    }
  } catch(e) {
    console.log(e)
    yield put(actions.getPlayersFailure(e))
  }
}

function* playersSagas() {
  yield all([
    yield takeLatest(types.GET_PLAYERS_REQUEST, getPlayers),
  ])
}

export default playersSagas
