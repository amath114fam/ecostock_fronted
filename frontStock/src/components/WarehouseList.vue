<script setup>
import { ref , onMounted
} from 'vue'
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
  <div class="page">
    <header class="page-header">
      <h1>Eco-Stock</h1>
      <p class="subtitle">Suivi des entrepôts et des stocks</p>
    </header>

    <main class="content">
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

      <ul class="warehouse-list">
        <li v-for="warehouse in warehouses" :key="warehouse.id" class="warehouse-card">
          <h2>{{ warehouse.nom }}</h2>
          <p>{{ warehouse.localisation }}</p>
        </li>
      </ul>
    </main>
  </div>
</template>

<style scoped>
.page {
  max-width: 640px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  background-color: #FAF7F2;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #232323;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
  color: #2F5D4E;
}

.subtitle {
  margin: 0.25rem 0 0;
  font-size: 0.95rem;
  color: #5a5a5a;
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
  margin-top: 1rem;
  font-size: 0.9rem;
}

.warehouse-list {
  list-style: none;
  padding: 0;
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.warehouse-card {
  background-color: #FFFFFF;
  padding: 1rem 1.25rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.warehouse-card h2 {
  margin: 0 0 0.25rem;
  font-size: 1.05rem;
  color: #232323;
}

.warehouse-card p {
  margin: 0;
  font-size: 0.9rem;
  color: #5a5a5a;
}
</style>