import { combineReducers } from 'redux'
import user from 'reducers/user'
import players from 'reducers/players'

export default combineReducers({
  user,
  players
})
