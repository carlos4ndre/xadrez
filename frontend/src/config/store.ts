import { createStore, applyMiddleware, compose } from 'redux'
import { createBrowserHistory } from 'history'
import { routerMiddleware } from 'connected-react-router'
import logger from 'config/logger'
import reducers from 'reducers'
import rootSaga from 'config/sagas'
import wsMiddleware from 'middlewares/websockets'
import createSagaMiddleware from 'redux-saga'

export const history = createBrowserHistory()

let middlewares = [wsMiddleware, routerMiddleware(history)]
const sagaMiddleware = createSagaMiddleware()
middlewares.push(sagaMiddleware)
if (process.env.NODE_ENV === 'development') {
  middlewares.push(logger)
}

const composeEnhancers = (window && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose

const store = createStore(
  reducers(history),
  composeEnhancers(
    applyMiddleware(...middlewares)
  )
)
sagaMiddleware.run(rootSaga)

export default store
