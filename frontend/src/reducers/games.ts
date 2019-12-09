import _ from 'lodash'
import { START_GAME, MOVE_PIECE_SUCCESS, END_GAME, GamesActionTypes } from 'actionTypes'
import { GamesState } from 'types/state'
import { Game } from 'types/game'

const initialState = {
  byId: {},
  allIds: [],
  isFetching: false
}

const reducer = (state: GamesState = initialState, action: GamesActionTypes) => {
  switch (action.type) {
    case START_GAME:
    case MOVE_PIECE_SUCCESS:
    case END_GAME:
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
