<script setup>
import { ref } from 'vue'
import { createWarehouse, updateWarehouse } from '../services/warehouseService.js'

// Props et emits pour le composant
const props = defineProps({
  warehouse: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['saved'])

const isEditMode = !!props.warehouse

const name = ref(props.warehouse?.nom ?? '')
const location = ref(props.warehouse?.localisation ?? '')
const capacity = ref(props.warehouse?.capacite ?? '')
const errorMessage = ref('')
const isLoading = ref(false)

// Gestion de la soumission du formulaire
async function handleSubmit() {
  isLoading.value = true
  errorMessage.value = ''

  // Prépare les données à envoyer au backend
  const payload = {
    nom: name.value,
    localisation: location.value,
    capacite: Number(capacity.value),
  }

  try {
    if (isEditMode) {
      await updateWarehouse(props.warehouse.id, payload)
      emit('saved')
    } else {
      await createWarehouse(payload)
      name.value = ''
      location.value = ''
      capacity.value = ''
      emit('saved')
    }
  } catch (error) {
    console.error('Erreur détaillée:', error)
    errorMessage.value = isEditMode
      ? 'Erreur lors de la mise à jour de l\'entrepôt.'
      : 'Erreur lors de la création de l\'entrepôt.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <form class="create-form" @submit.prevent="handleSubmit">
    <h2>{{ isEditMode ? 'Modifier l\'entrepôt' : 'Nouvel entrepôt' }}</h2>
    <p class="form-hint">
      {{
        isEditMode
          ? 'Mets à jour les informations de cet entrepôt.'
          : 'Renseignez les informations de l\'entrepôt à ajouter.'
      }}
    </p>

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
      {{
        isLoading
          ? (isEditMode ? 'Enregistrement...' : 'Création...')
          : (isEditMode ? 'Enregistrer les modifications' : 'Créer l\'entrepôt')
      }}
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