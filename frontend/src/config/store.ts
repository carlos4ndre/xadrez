import { createStore, applyMiddleware, compose } from 'redux'
import logger from 'config/logger'
import reducers from 'reducers'
import rootSaga from 'config/sagas'
import wsMiddleware from 'middlewares/websockets'
import createSagaMiddleware from 'redux-saga'

let middleware = [wsMiddleware]
const sagaMiddleware = createSagaMiddleware()
middleware.push(sagaMiddleware)
if (process.env.NODE_ENV === 'development') {
  middleware.push(logger)
}

const composeEnhancers = (window && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose

const store = createStore(reducers, composeEnhancers(
  applyMiddleware(...middleware)
))

sagaMiddleware.run(rootSaga)

export default store
