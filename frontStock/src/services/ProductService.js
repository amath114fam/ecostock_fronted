import { authFetch } from './authService.js'

const API_URL = 'http://localhost:8000/api'

export async function fetchProducts() {
  try {
    const response = await fetch(`${API_URL}/products/`)

    if (!response.ok) {
      throw new Error('Impossible de récupérer les produits')
    }

    return await response.json()
  } catch (error) {
    console.error('Erreur lors de la récupération des produits :', error)
    throw error
  }
}


export async function createProduct(productData) {
  const response = await authFetch(`${API_URL}/products/`, {
    method: 'POST',
    body: JSON.stringify(productData),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    console.error('Erreur API:', response.status, errorBody)
    throw new Error('Impossible de créer le produit')
  }

  try {
    return await response.json()
  } catch (parseError) {
    console.warn('Réponse non-JSON malgré un statut OK:', parseError)
    return null
  }
}


export async function updateProduct(id, data) {
  const response = await authFetch(`${API_URL}/products/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Erreur lors de la mise à jour du produit')
  }

  return response.json()
}

export async function deleteProduct(id) {
  const response = await authFetch(`${API_URL}/products/${id}/`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Erreur lors de la suppression du produit')
  }

}