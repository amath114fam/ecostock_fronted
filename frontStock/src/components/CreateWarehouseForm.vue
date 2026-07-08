<script setup>
import { ref } from 'vue'
import { createWarehouse } from '../services/warehouseService.js'

const emit = defineEmits(['created'])

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
    emit('created')
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
    <p class="form-hint">Renseignez les informations de l'entrepôt à ajouter.</p>

    <label class="field">
      <span class="field-label">Nom</span>
      <input v-model="name" type="text" placeholder="Ex. Entrepôt Nord" class="input-field" />
    </label>

    <label class="field">
      <span class="field-label">Localisation</span>
      <input v-model="location" type="text" placeholder="Ex. Dakar, Sénégal" class="input-field" />
    </label>

    <label class="field">
      <span class="field-label">Capacité</span>
      <input v-model="capacity" type="number" placeholder="Ex. 500" class="input-field" />
    </label>

    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

    <button type="submit" class="btn-primary" :disabled="isLoading">
      {{ isLoading ? 'Création...' : 'Créer l\'entrepôt' }}
    </button>
  </form>
</template>

<style scoped>
.create-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 420px;
  background-color: #FFFFFF;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
}

.create-form h2 {
  margin: 0;
  font-size: 1.15rem;
  color: #232323;
}

.form-hint {
  margin: -0.5rem 0 0;
  font-size: 0.85rem;
  color: #5a5a5a;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.field-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #232323;
}

.input-field {
  padding: 0.55rem 0.75rem;
  border: 1px solid #d8d3c9;
  border-radius: 6px;
  font-size: 0.9rem;
  width: 100%;
  box-sizing: border-box;
  font-family: inherit;
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

.btn-primary:hover:not(:disabled) {
  background-color: #264a3e;
}

.btn-primary:disabled {
  background-color: #a8b8b3;
  cursor: not-allowed;
}

.error-message {
  color: #B5502F;
  font-size: 0.85rem;
  margin: 0;
}
</style>