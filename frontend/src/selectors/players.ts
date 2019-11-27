import { createSelector } from 'reselect'
import { AppState } from 'types/state'

export const players = (state: AppState) => state.players

export const getPlayers = createSelector(
  players,
  (players) => Object.values(players.byId)
)
