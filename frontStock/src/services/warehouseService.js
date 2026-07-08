import { authFetch } from './authService.js'

const API_URL = 'http://localhost:8000/api'

export async function fetchWarehouses() {
  try {
    const response = await fetch(`${API_URL}/warehouse/`)

    if (!response.ok) {
      throw new Error('Impossible de récupérer les entrepôts')
    }

    return await response.json()
  } catch (error) {
    console.error('Erreur lors de la récupération des entrepôts :', error)
    throw error
  }
}


export async function createWarehouse(warehouseData) {
  const response = await authFetch(`${API_URL}/warehouse/`, {
    method: 'POST',
    body: JSON.stringify(warehouseData),
  })

  if (!response.ok) {
    console.error(error)
    throw new Error('Impossible de créer l\'entrepôt')
  }

  return await response.json()
}


export async function updateWarehouse(id, data) {
  const response = await authFetch(`${API_URL}/warehouse/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Erreur lors de la mise à jour de l\'entrepôt')
  }

  return response.json()
}

export async function deleteWarehouse(id) {
  const response = await authFetch(`${API_URL}/warehouse/${id}/`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Erreur lors de la suppression de l\'entrepôt')
  }

}