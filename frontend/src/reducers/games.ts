import _ from 'lodash'
import { START_GAME, MOVE_PIECE_SUCCESS, GamesActionTypes } from 'actionTypes'
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
      return startGame(state, action.game)
    case MOVE_PIECE_SUCCESS:
      return movePiece(state, action.game)
    default:
      return state
  }
}

const startGame = (state: GamesState, game: Game) => {
  return {
    ...state,
    ...addGame(state, game),
    isFetching: false
  }
}

const movePiece = (state: GamesState, game: Game) => {
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
