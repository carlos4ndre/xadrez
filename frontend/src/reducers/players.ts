import _ from 'lodash'
import { GET_PLAYERS_REQUEST, GET_PLAYERS_SUCCESS, GET_PLAYERS_FAILURE, PlayersActionTypes } from 'actionTypes'
import { PlayersState } from 'types/state'
import { Player } from 'types/player'

const initialState = {
  byId: {},
  allIds: [],
  isFetching: false
}

const reducer = (state: PlayersState = initialState, action: PlayersActionTypes) => {
  switch (action.type) {
    case GET_PLAYERS_REQUEST:
      return getPlayers(state)
    case GET_PLAYERS_SUCCESS:
      return getPlayersSuccess(state, action.players)
    case GET_PLAYERS_FAILURE:
      return getPlayersFailure(state)
    default:
      return state
  }
}

const getPlayers = (state: PlayersState) => {
  return {
    ...state,
    isFetching: true
  }
}

const getPlayersSuccess = (state: PlayersState, players: Player[]) => {
  return {
    ...state,
    ...addPlayers(state, players),
    isFetching: false
  }
}

const getPlayersFailure = (state: PlayersState) => {
  return {
    ...state,
    isFetching: false
  }
}

const addPlayers = (state: PlayersState, players: Player[] = []) => (
  players.reduce((obj, player) => addPlayer(obj, player), state)
)

const addPlayer = (state: PlayersState, player: Player) => ({
  ...state,
  byId: {
    ...state.byId,
    [player.id]: player
  },
  allIds: _.uniq(state.allIds.concat(player.id))
})

export default reducer
