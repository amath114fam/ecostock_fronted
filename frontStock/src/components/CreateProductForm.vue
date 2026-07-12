<script setup>
import { ref, onMounted } from 'vue'
import { createProduct, updateProduct } from '../services/ProductService.js'
import { fetchWarehouses } from '../services/warehouseService.js'


const props = defineProps({
  product: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['saved', 'updated'])

const isEditMode = !!props.product

// Mêmes valeurs ETAT supposées que dans ProductDetailsModal.vue  à garder synchronisées.
const ETAT_CHOICES = [
  { value: 'disponible', label: 'Disponible' },
  { value: 'reserver', label: 'Réservé' },
  { value: 'perimer', label: 'Périmé' },
]

const name = ref(props.product?.nom ?? '')
const quantity = ref(props.product?.quantite ?? '')
const etat = ref(props.product?.etat ?? 'disponible')
const dateExpiration = ref(props.product?.date_expiration ?? '')
const warehouseId = ref(props.product?.entrepot ?? '')
const errorMessage = ref('')
const isLoading = ref(false)

const warehouses = ref([])
const warehousesError = ref('')
const isLoadingWarehouses = ref(false)

// charge la liste des entrepôts pour le select
async function loadWarehouses() {
  isLoadingWarehouses.value = true
  warehousesError.value = ''

  try {
    warehouses.value = await fetchWarehouses()
  } catch (error) {
    warehousesError.value = 'Impossible de charger la liste des entrepôts.'
  } finally {
    isLoadingWarehouses.value = false
  }
}

// Charge la liste des entrepôts au montage du composant
onMounted(() => {
  loadWarehouses()
})


// Gestion de la soumission du formulaire
async function handleSubmit() {
  isLoading.value = true
  errorMessage.value = ''

  const payload = {
    nom: name.value,
    quantite: Number(quantity.value),
    etat: etat.value,
    date_expiration: dateExpiration.value,
    entrepot: warehouseId.value,
  }

  try {
    if (isEditMode) {
      await updateProduct(props.product.id, payload)
      emit('updated', 'Produit mis à jour avec succès.')
    } else {
      await createProduct(payload)
      name.value = ''
      quantity.value = ''
      etat.value = 'disponible'
      dateExpiration.value = ''
      warehouseId.value = ''
      emit('saved', 'Produit créé avec succès.')
    }
   
  } catch (error) {
    console.error('Erreur détaillée:', error)
    errorMessage.value = isEditMode
      ? 'Erreur lors de la mise à jour du produit.'
      : 'Erreur lors de la création du produit.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <form class="create-form" @submit.prevent="handleSubmit">
    <h2>{{ isEditMode ? 'Modifier le produit' : 'Nouveau produit' }}</h2>
    <p class="form-hint">
      {{
        isEditMode
          ? 'Mets à jour les informations de ce produit.'
          : 'Renseignez les informations du produit à ajouter.'
      }}
    </p>

    <label class="field">
      <span class="field-label">Nom</span>
      <input v-model="name" type="text" placeholder="Ex. Ordinateur" class="input-field" />
    </label>

    <label class="field">
      <span class="field-label">Entrepôt</span>
      <select v-model="warehouseId" class="input-field select-field" :disabled="isLoadingWarehouses">
        <option value="" disabled>
          Choisir un entrepôt
        </option>
        <option v-for="warehouse in warehouses" :key="warehouse.id" :value="warehouse.id">
          {{ warehouse.nom }}
        </option>
      </select>
      <span v-if="warehousesError" class="error-message">{{ warehousesError }}</span>
    </label>

    <label class="field">
      <span class="field-label">Quantité</span>
      <input v-model="quantity" type="number" placeholder="Ex. 120" class="input-field" />
    </label>

    <label class="field">
      <span class="field-label">État</span>
      <select v-model="etat" class="input-field select-field">
        <option v-for="choice in ETAT_CHOICES" :key="choice.value" :value="choice.value">
          {{ choice.label }}
        </option>
      </select>
    </label>

    <label class="field">
      <span class="field-label">Date d'expiration</span>
      <input v-model="dateExpiration" type="date" class="input-field" />
    </label>

    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

    <button type="submit" class="btn-primary" :disabled="isLoading || !warehouseId">
      {{
        isLoading
          ? (isEditMode ? 'Enregistrement...' : 'Création...')
          : (isEditMode ? 'Enregistrer les modifications' : 'Créer le produit')
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

.select-field {
  appearance: none;
  background-color: #FFFFFF;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%235a5a5a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.6rem center;
  padding-right: 2rem;
  cursor: pointer;
}

.select-field:disabled {
  background-color: #FAF7F2;
  cursor: not-allowed;
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