<script setup>
import { ref, onMounted, computed } from 'vue'
import { fetchProducts, deleteProduct, moveProduct } from '../services/ProductService.js'
import { fetchWarehouses } from '../services/warehouseService.js'
import ProductDetailsModal from './ProductDetailsModal.vue'
import CreateProductForm from './CreateProductForm.vue'

const props = defineProps({
  search: {
    type: String,
    default: '',
  },
})

const isMoving = ref(false)
const moveError = ref('')
const targetWarehouseId = ref('')

const products = ref([])
const warehouses = ref([])
const errorMessage = ref('')

const activeProduct = ref(null)
const modalMode = ref(null) 
const isDeleting = ref(false)
const deleteError = ref('')

const emit = defineEmits(['delete', 'move', 'update'])


// Charge les produits et les entrepôts depuis le backend
async function loadData() {
  try {
    const [productsResult, warehousesResult] = await Promise.all([
      fetchProducts(),
      fetchWarehouses(),
    ])
    products.value = productsResult
    warehouses.value = warehousesResult
  } catch (error) {
    errorMessage.value = 'Impossible de charger les produits. Réessaie plus tard.'
  }
}

// Charge les données au montage du composant
onMounted(() => {
  loadData()
})

// Fonction utilitaire pour obtenir le nom de l'entrepôt à partir de son ID
function warehouseName(id) {
  const warehouse = warehouses.value.find((item) => item.id === id)
  return warehouse ? warehouse.nom : '—'
}

// Ouvre le modal de détails pour un produit donné
function openDetails(product) {
  activeProduct.value = product
  modalMode.value = 'details'
}

// Ouvre le modal d'édition pour un produit donné
function openEdit(product) {
  activeProduct.value = product
  modalMode.value = 'edit'
}

// Ouvre le modal de confirmation de suppression pour un produit donné
function openDeleteConfirm(product) {
  activeProduct.value = product
  modalMode.value = 'delete'
  deleteError.value = ''
}

// Ouvre le modal de confirmation de déplacement pour un produit donné
function closeModal() {
//   if (isDeleting.value) return
  activeProduct.value = null
  modalMode.value = null
  deleteError.value = ''
}

// Gère la sauvegarde après l'édition ou la création d'un produit
function handleSaved(message) {
  closeModal()
  loadData()
  if (message) emit('update', message) 
}

// Confirme la suppression d'un produit
async function confirmDelete() {
  isDeleting.value = true
  deleteError.value = ''

  try {
    await deleteProduct(activeProduct.value.id)
    closeModal()
    loadData()
    emit('delete', 'Produit supprimé avec succès.')
  } catch (error) {
    deleteError.value = 'Erreur lors de la suppression du produit.'
  } finally {
    isDeleting.value = false
  }
}


// Ouvre le modal de confirmation de déplacement pour un produit donné
function openMoveConfirm(product) {
  activeProduct.value = product
  modalMode.value = 'move'
  moveError.value = ''
  targetWarehouseId.value = ''
}

// Confirme le déplacement d'un produit vers un autre entrepôt
async function confirmMove() {
  isMoving.value = true
  moveError.value = ''

  try {
    await moveProduct(activeProduct.value.id, targetWarehouseId.value)
    closeModal()
    loadData()
    emit('move', 'Produit déplacé avec succès.')
  } catch (error) {
    moveError.value = error.message || 'Erreur lors du déplacement du produit.'
  } finally {
    isMoving.value = false
  }
}

// Filtre les produits en fonction de la recherche
const filteredProducts = computed(() => {
  if (!props.search) {
    return products.value
  }
  console.log(products.value)
  return products.value.filter((product) => {
    const nameMatch = product.nom.toLowerCase().includes(props.search.toLowerCase())
    const warehouseMatch = warehouseName(product.entrepot).toLowerCase().includes(props.search.toLowerCase())
    return nameMatch || warehouseMatch
  })
})



</script>

<template>
  <div>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

    <div v-else-if="products.length === 0" class="empty-state">
      <p>Aucun produit pour l'instant.</p>
      <span>Utilisez le bouton « Ajouter un produit » pour créer le premier.</span>
    </div>

    <ul v-else class="list-grid">
      <li v-for="product in filteredProducts" :key="product.id" class="card">
        <div class="card-header">
          <div class="card-icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 8 12 3 3 8l9 5 9-5Z" />
              <path d="M3 8v8l9 5 9-5V8" />
              <path d="M12 13v8" />
            </svg>
          </div>

          <div class="card-actions">
            <button
              type="button"
              class="icon-btn"
              title="Voir les détails"
              aria-label="Voir les détails"
              @click="openDetails(product)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
            <button
              type="button"
              class="icon-btn"
              title="Modifier"
              aria-label="Modifier"
              @click="openEdit(product)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              </svg>
            </button>

            <button
                type="button"
                class="icon-btn"
                title="Déplacer vers un autre entrepôt"
                aria-label="Déplacer"
                @click="openMoveConfirm(product)"
                >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                </svg>
            </button>
            <button
              type="button"
              class="icon-btn icon-btn-danger"
              title="Supprimer"
              aria-label="Supprimer"
              @click="openDeleteConfirm(product)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 6h18" />
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
              </svg>
            </button>
          </div>
        </div>

        <h2>{{ product.nom }}</h2>
        <p v-if="product.prix != null" class="card-meta">{{ product.prix }} FCFA</p>
        <p class="card-meta card-warehouse">{{ warehouseName(product.entrepot) }}</p>
        <p v-if="product.quantite != null" class="card-tag">Stock : {{ product.quantite }}</p>
      </li>
    </ul>

    <div v-if="modalMode" class="modal-overlay" @click.self="closeModal">
      <div class="modal-panel">
        <ProductDetailsModal
          v-if="modalMode === 'details'"
          :product="activeProduct"
          :warehouse-name="warehouseName(activeProduct.entrepot)"
          @close="closeModal"
        />
        <template v-else-if="modalMode === 'edit'">
          <button type="button" class="modal-close" aria-label="Fermer" @click="closeModal">✕</button>
          <CreateProductForm :product="activeProduct" @updated="handleSaved"  />
        </template>
        <div v-else-if="modalMode === 'delete'" class="confirm-delete">
          <h2>Supprimer ce produit ?</h2>
          <p>
            Tu es sur le point de supprimer
            <strong>{{ activeProduct.nom }}</strong>. Cette action est irréversible.
          </p>

          <p v-if="deleteError" class="error-message">{{ deleteError }}</p>

          <div class="confirm-actions">
            <button type="button" class="btn-secondary" :disabled="isDeleting" @click="closeModal">
              Annuler
            </button>
            <button type="button" class="btn-danger" :disabled="isDeleting" @click="confirmDelete">
              {{ isDeleting ? 'Suppression...' : 'Supprimer' }}
            </button>
          </div>
        </div>

        <div v-else-if="modalMode === 'move'" class="confirm-delete">
            <h2>Déplacer ce produit</h2>
            <p>
                Déplacer <strong>{{ activeProduct.nom }}</strong> vers un autre entrepôt.
            </p>

            <label class="field">
                <span class="field-label">Entrepôt de destination</span>
                <select v-model="targetWarehouseId" class="input-field select-field">
                <option value="" disabled>Choisir un entrepôt</option>
                <option
                    v-for="warehouse in warehouses.filter(w => w.id !== activeProduct.entrepot)"
                    :key="warehouse.id"
                    :value="warehouse.id"
                >
                    {{ warehouse.nom }}
                </option>
                </select>
            </label>

            <p v-if="moveError" class="error-message">{{ moveError }}</p>

            <div class="confirm-actions">
                <button type="button" class="btn-secondary" :disabled="isMoving" @click="closeModal">
                Annuler
                </button>
                <button type="button" class="btn-primary" :disabled="isMoving || !targetWarehouseId" @click="confirmMove">
                {{ isMoving ? 'Déplacement...' : 'Déplacer' }}
                </button>
             </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-grid {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 1rem;
}

.card {
  background-color: #FFFFFF;
  padding: 1.1rem 1.25rem;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  border-left: 4px solid #2F5D4E;
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.6rem;
}

.card-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background-color: #FAF7F2;
  color: #2F5D4E;
  flex-shrink: 0;
}

.card-actions {
  display: flex;
  gap: 0.35rem;
}

.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: 1px solid #d8d3c9;
  border-radius: 6px;
  background-color: #FFFFFF;
  color: #5a5a5a;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}

.icon-btn:hover {
  background-color: #2F5D4E;
  border-color: #2F5D4E;
  color: #FFFFFF;
}

.icon-btn-danger:hover {
  background-color: #B5502F;
  border-color: #B5502F;
  color: #FFFFFF;
}

.card h2 {
  margin: 0 0 0.25rem;
  font-size: 1.02rem;
  color: #232323;
}

.card-meta {
  margin: 0;
  font-size: 0.88rem;
  color: #5a5a5a;
}

.card-warehouse {
  font-weight: 600;
  color: #2F5D4E;
  margin-top: 0.15rem;
}

.card-tag {
  margin: 0.5rem 0 0;
  display: inline-block;
  font-size: 0.78rem;
  font-weight: 600;
  color: #2F5D4E;
  background-color: #FAF7F2;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
}

.error-message {
  color: #B5502F;
  font-size: 0.9rem;
}

.empty-state {
  background-color: #FFFFFF;
  border: 1px dashed #d8d3c9;
  border-radius: 10px;
  padding: 2rem 1.5rem;
  text-align: center;
}

.empty-state p {
  margin: 0 0 0.35rem;
  font-weight: 600;
  color: #232323;
}

.empty-state span {
  font-size: 0.88rem;
  color: #5a5a5a;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(35, 35, 35, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  z-index: 50;
  box-sizing: border-box;
}

.modal-panel {
  position: relative;
  width: 100%;
  max-width: 440px;
  max-height: 90vh;
  overflow-y: auto;
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
  box-sizing: border-box;
}

.modal-panel :deep(.create-form) {
  box-shadow: none;
  padding: 0;
  max-width: none;
}

.modal-close {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 28px;
  height: 28px;
  border: none;
  background-color: #FAF7F2;
  color: #5a5a5a;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  line-height: 1;
}

.modal-close:hover {
  background-color: #B5502F;
  color: #FFFFFF;
}

@media (max-width: 480px) {
  .modal-panel {
    padding: 1.25rem 1rem;
  }
}

.confirm-delete h2 {
  margin: 0 0 0.75rem;
  font-size: 1.1rem;
  color: #232323;
}

.confirm-delete p {
  margin: 0 0 1.25rem;
  font-size: 0.9rem;
  color: #5a5a5a;
  line-height: 1.5;
}

.confirm-delete strong {
  color: #232323;
}

.confirm-actions {
  display: flex;
  gap: 0.75rem;
}

.confirm-actions button {
  flex: 1;
}

.btn-secondary {
  background-color: transparent;
  border: 1px solid #d8d3c9;
  color: #232323;
  padding: 0.6rem 1.1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #FAF7F2;
}

.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-danger {
  background-color: #B5502F;
  color: #FFFFFF;
  border: none;
  padding: 0.6rem 1.1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.btn-danger:hover:not(:disabled) {
  background-color: #963f24;
}

.btn-danger:disabled {
  background-color: #d9a894;
  cursor: not-allowed;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 1.25rem;
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

.select-field {
  appearance: none;
  background-color: #FFFFFF;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%235a5a5a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.6rem center;
  padding-right: 2rem;
  cursor: pointer;
}

.btn-primary {
  background-color: #2F5D4E;
  color: #FFFFFF;
  border: none;
  padding: 0.6rem 1.1rem;
  border-radius: 6px;
  font-size: 0.9rem;
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

.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #2F5D4E;
  color: white;
  padding: 15px;
  border-radius: 5px;
  z-index: 1000;
  opacity: 0.95;
  transition: opacity 0.5s ease;
}
</style>