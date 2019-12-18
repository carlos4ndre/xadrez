import { all, takeLatest, call, put } from 'redux-saga/effects'
import * as actions from 'actions'
import * as api from 'utils/api'
import * as types from 'actionTypes'
import { PlayerStatus } from 'types/player'

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

const addUserAsPlayer = function*(action: types.LoginUserSuccess) {
  const player = {
    'id': action.user.profile.sub,
    'email': action.user.profile.email,
    'nickname': action.user.profile.nickname,
    'name': action.user.profile.name,
    'picture': action.user.profile.picture,
    'status': PlayerStatus.ONLINE
  }
  yield put(actions.addPlayer(player))
}

const addPlayer = function*(action: types.CreateGameQuestion) {
  yield put(actions.addPlayer(action.challenger))
}

function* playersSagas() {
  yield all([
    yield takeLatest(types.GET_PLAYERS_REQUEST, getPlayers),
    yield takeLatest(types.LOGIN_USER_SUCCESS, addUserAsPlayer),
    yield takeLatest(types.CREATE_GAME_QUESTION, addPlayer),
  ])
}

export default playersSagas
