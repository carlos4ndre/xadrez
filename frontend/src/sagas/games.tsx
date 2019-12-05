import React from 'react'
import { all, takeLatest, call } from 'redux-saga/effects'
import * as types from 'actionTypes'
import { toast } from 'react-toastify'
import CreateGameQuestion from 'containers/CreateGameQuestion'
import store from 'config/store'


const createGameQuestion = function*(action: types.CreateGameQuestion) {
  yield call(toast.info, <CreateGameQuestion store={store} challenger={action.challenger} game={action.game}/>)
}

const acceptGame = function*(action: types.AcceptGame) {
  yield call(toast.success, 'Let the game begin!')
}

const rejectGame = function*(action: types.RejectGame) {
  yield call(toast.error, 'No problem, maybe next time')
}

function* gamesSagas() {
  yield all([
    yield takeLatest(types.CREATE_GAME_QUESTION, createGameQuestion),
    yield takeLatest(types.ACCEPT_GAME, acceptGame),
    yield takeLatest(types.REJECT_GAME, rejectGame),
  ])
}

export default gamesSagas
