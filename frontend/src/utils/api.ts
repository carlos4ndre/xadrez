import { apiEndpoint } from 'config/app'

export const getPlayers = (token: string) => {
  const headers = {
    'Accept': 'application/json',
    'Authorization': token
  }

  return fetch(`${apiEndpoint}/players`, { headers })
}
