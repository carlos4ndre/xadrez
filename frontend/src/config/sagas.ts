import { all } from 'redux-saga/effects'
import sagas from 'sagas'

const rootSaga = function*() {
  yield all(sagas)
}

export default rootSaga
