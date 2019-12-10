import _ from 'lodash'
import * as types from 'actionTypes'
import { GamesState } from 'types/state'
import { Game } from 'types/game'

const initialState = {
  byId: {},
  allIds: [],
  isFetching: false
}

const reducer = (state: GamesState = initialState, action: types.GamesActionTypes) => {
  switch (action.type) {
    case types.START_GAME:
    case types.MOVE_PIECE_SUCCESS:
    case types.END_GAME:
      return upsertGame(state, action.game)
    default:
      return state
  }
}

const upsertGame = (state: GamesState, game: Game) => {
  return {
    ...state,
    ...addGame(state, game),
    isFetching: false
  }
}

const addGame = (state: GamesState, game: Game) => ({
  ...state,
  byId: {
    ...state.byId,
    [game.id]: game
  },
  allIds: _.uniq(state.allIds.concat(game.id))
})

export default reducer
