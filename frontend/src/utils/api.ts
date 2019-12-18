import { apiEndpoint } from 'config/app'

export const getPlayers = (token: string) => {
  const headers = {
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  }

  return fetch(`${apiEndpoint}/players`, { headers })
}

export const getPlayer = (token: string, playerId: string) => {
  const headers = {
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  }

  return fetch(`${apiEndpoint}/players/${playerId}`, { headers })
}
