import { createSelector } from 'reselect'
import { AppState } from 'types/state'

export const games = (state: AppState) => state.games
export const gameId = (state: AppState, id: string) => id

export const getGames = createSelector(
  games,
  (games) => Object.values(games.byId)
)

export const getGame = createSelector(
  [ games, gameId ],
  (games, id) => games.byId[id]
)
