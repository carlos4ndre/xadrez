import React from 'react'
import { all, takeLatest, put, call } from 'redux-saga/effects'
import { push } from 'connected-react-router'
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

const startGame = function*(action: types.StartGame) {
  const gameId = action.game.id
  yield put(push(`/game/${gameId}`))
  yield call(toast.success, 'Game has started!')
}

const endGame = function*(action: types.EndGame) {
  switch(action.game.status) {
    case 'rejected':
      yield call(toast.error, 'Game request was rejected')
      break
    case 'resigned':
      yield call(toast.error, 'The player has resigned')
      break
    case 'checkmate':
      const winner = (action.game.result === 'white_wins' ? 'White' : 'Black')
      yield call(toast.info, `${winner} is victourious`)
      break
    case 'insufficient_material':
      yield call(toast.info, 'Match is over due to insufficient material')
      break
    case 'seventy_five_moves':
      yield call(toast.info, 'Match is over due to seventy five moves')
      break
    case 'five_fold_repetition':
      yield call(toast.info, 'Match is over due to five fold repetition')
      break
    case 'out_of_time':
      yield call(toast.info, 'Match is over due to out of time')
      break
    default:
      yield call(toast.error, 'Game ended due to unknown error')
  }
}

const movePieceFailure = function*(action: types.MovePieceFailure) {
  yield call(toast.error, 'Move piece failure')
}

function* gamesSagas() {
  yield all([
    yield takeLatest(types.CREATE_GAME_QUESTION, createGameQuestion),
    yield takeLatest(types.ACCEPT_GAME, acceptGame),
    yield takeLatest(types.REJECT_GAME, rejectGame),
    yield takeLatest(types.START_GAME, startGame),
    yield takeLatest(types.MOVE_PIECE_FAILURE, movePieceFailure),
    yield takeLatest(types.END_GAME, endGame)
  ])
}

export default gamesSagas
