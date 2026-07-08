<script setup>
import { ref, onMounted } from 'vue'
import { fetchWarehouses } from '../services/warehouseService.js'

const warehouses = ref([])
const errorMessage = ref('')

async function loadWarehouses() {
  try {
    warehouses.value = await fetchWarehouses()
  } catch (error) {
    errorMessage.value = 'Impossible de charger les entrepôts. Réessaie plus tard.'
  }
}

onMounted(() => {
  loadWarehouses()
})
</script>

<template>
  <div>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

    <div v-else-if="warehouses.length === 0" class="empty-state">
      <p>Aucun entrepôt pour l'instant.</p>
      <span>Utilisez le bouton « Ajouter un entrepôt » pour créer le premier.</span>
    </div>

    <ul v-else class="list-grid">
      <li v-for="warehouse in warehouses" :key="warehouse.id" class="card">
        <div class="card-icon" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9.5 12 3l9 6.5" />
            <path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" />
          </svg>
        </div>
        <h2>{{ warehouse.nom }}</h2>
        <p class="card-meta">{{ warehouse.localisation }}</p>
        <p v-if="warehouse.capacite" class="card-tag">Capacité : {{ warehouse.capacite }}</p>
      </li>
    </ul>
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

.card-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background-color: #FAF7F2;
  color: #2F5D4E;
  margin-bottom: 0.6rem;
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
</style>