import { API_URL } from './config.js'

//connecte l'utilisateur en envoyant les identifiants à l'API et stocke les tokens dans le localStorage
export async function login(username, password) {
  const response = await fetch(`${API_URL}/token/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })

  if (!response.ok) {
    throw new Error('Identifiants incorrects')
  }

  const data = await response.json()
  localStorage.setItem('access_token', data.access)
  localStorage.setItem('refresh_token', data.refresh)

  return data
}

export function getAccessToken() {
  return localStorage.getItem('access_token')
}

// Déconnecte l'utilisateur en supprimant les tokens du localStorage
export function logout() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}

// Vérifie si l'utilisateur est authentifié en vérifiant la présence d'un token d'accès dans le localStorage
export async function authFetch(url, options = {}) {
  const token = getAccessToken()

  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  }

  return fetch(url, { ...options, headers })
}