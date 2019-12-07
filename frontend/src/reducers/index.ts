import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import { RouterState, connectRouter } from 'connected-react-router'
import { History } from 'history'
import user from 'reducers/user'
import players from 'reducers/players'
import games from 'reducers/games'

const reducers = (history: History) => combineReducers({
  router: connectRouter(history),
  user,
  games,
  players,
  form: formReducer
})

export interface State {
  count: number
  router: RouterState
}

export default reducers
