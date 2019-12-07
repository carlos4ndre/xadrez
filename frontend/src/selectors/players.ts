import { createSelector } from 'reselect'
import { AppState } from 'types/state'

export const players = (state: AppState) => state.players
export const playerId = (state: AppState, id: string) => id

export const getPlayers = createSelector(
  players,
  (players) => Object.values(players.byId)
)

export const getPlayer = createSelector(
  [ players, playerId ],
  (players, id) => players.byId[id]
)
