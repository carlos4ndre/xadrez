import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import user from 'reducers/user'
import players from 'reducers/players'

export default combineReducers({
  user,
  players,
  form: formReducer
})
