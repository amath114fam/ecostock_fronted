import { authFetch } from './authService.js'
import { API_URL } from './config.js'
// Récupère la liste des entrepôts depuis l'API
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

// Crée un nouvel entrepôt en envoyant les données à l'API
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

// Met à jour un entrepôt existant en envoyant les données à l'API
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

// Supprime un entrepôt en envoyant une requête DELETE à l'API
export async function deleteWarehouse(id) {
  const response = await authFetch(`${API_URL}/warehouse/${id}/`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Erreur lors de la suppression de l\'entrepôt')
  }

}