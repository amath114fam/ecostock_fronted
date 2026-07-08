<script setup>
import { ref } from 'vue'
import { createWarehouse } from '../services/warehouseService.js'

const name = ref('')
const location = ref('')
const capacity = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

async function handleSubmit() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    await createWarehouse({
      nom: name.value,
      localisation: location.value,
      capacite: Number(capacity.value),
    })
    name.value = ''
    location.value = ''
    capacity.value = ''
  } catch (error) {
    errorMessage.value = 'Erreur lors de la création de l\'entrepôt.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <form class="create-form" @submit.prevent="handleSubmit">
    <h2>Nouvel entrepôt</h2>

    <input v-model="name" type="text" placeholder="Nom" class="input-field" />
    <input v-model="location" type="text" placeholder="Localisation" class="input-field" />
    <input v-model="capacity" type="number" placeholder="Capacité" class="input-field" />

    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

    <button type="submit" class="btn-primary" :disabled="isLoading">
      {{ isLoading ? 'Création...' : 'Créer' }}
    </button>
  </form>
</template>

<style scoped>
.create-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 320px;
  background-color: #FFFFFF;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  margin-bottom: 1.5rem;
}

.create-form h2 {
  margin: 0 0 0.5rem;
  font-size: 1.2rem;
  color: #2F5D4E;
}

.input-field {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d8d3c9;
  border-radius: 6px;
  font-size: 0.9rem;
}

.input-field:focus {
  outline: 2px solid #2F5D4E;
  outline-offset: 1px;
}

.btn-primary {
  background-color: #2F5D4E;
  color: #FFFFFF;
  border: none;
  padding: 0.65rem 1.25rem;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.error-message {
  color: #B5502F;
  font-size: 0.85rem;
  margin: 0;
}

</style>