<script setup>
import { ref, computed, onMounted } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'
import { fetchProducts } from '../services/ProductService.js'
import { fetchWarehouses } from '../services/warehouseService.js'

// Enregistre les composants nécessaires pour Chart.js
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const products = ref([])
const warehouses = ref([])
const errorMessage = ref('')
const isLoading = ref(false)

// Charge les données des produits et des entrepôts pour le tableau de bord
async function loadData() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const [productsResult, warehousesResult] = await Promise.all([
      fetchProducts(),
      fetchWarehouses(),
    ])
    products.value = productsResult
    warehouses.value = warehousesResult
  } catch (error) {
    errorMessage.value = 'Impossible de charger les statistiques. Réessaie plus tard.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadData()
})

// Calcul des statistiques pour le tableau de bord
const totalProducts = computed(() => products.value.length)

const availableCount = computed(
  () => products.value.filter((product) => product.etat === 'disponible').length
)

const outOfStockCount = computed(
  () => products.value.filter((product) => product.etat === 'rupture').length
)

const expiredCount = computed(
  () => products.value.filter((product) => product.etat === 'perimer').length
)

// Prépare les données pour les cartes de résumé et le graphique
const summaryCards = computed(() => [
  {
    key: 'total',
    label: 'Total produits',
    value: totalProducts.value,
    tone: 'neutral',
    icon: 'box',
  },
  {
    key: 'disponible',
    label: 'Produits disponibles',
    value: availableCount.value,
    tone: 'positive',
    icon: 'check',
  },
  {
    key: 'rupture',
    label: 'Produits en rupture',
    value: outOfStockCount.value,
    tone: 'warning',
    icon: 'alert',
  },
  {
    key: 'perime',
    label: 'Produits périmés',
    value: expiredCount.value,
    tone: 'warning',
    icon: 'clock',
  },
])

// Calcul des statistiques par entrepôt pour le graphique
const warehouseStats = computed(() =>
  warehouses.value.map((warehouse) => {
    const warehouseProducts = products.value.filter(
      (product) => product.entrepot === warehouse.id
    )

    return {
      id: warehouse.id,
      nom: warehouse.nom,
      total: warehouseProducts.length,
      disponible: warehouseProducts.filter((p) => p.etat === 'disponible').length,
      rupture: warehouseProducts.filter((p) => p.etat === 'rupture').length,
      perime: warehouseProducts.filter((p) => p.etat === 'perimer').length,
    }
  })
)

// Prépare les données et les options pour le graphique à barres
const chartData = computed(() => ({
  labels: warehouseStats.value.map((w) => w.nom),
  datasets: [
    {
      label: 'Disponibles',
      backgroundColor: '#2F5D4E',
      data: warehouseStats.value.map((w) => w.disponible),
    },
    {
      label: 'En rupture',
      backgroundColor: '#d8a24a',
      data: warehouseStats.value.map((w) => w.rupture),
    },
    {
      label: 'Périmés',
      backgroundColor: '#B5502F',
      data: warehouseStats.value.map((w) => w.perime),
    },
  ],
}))

// Options pour le graphique à barres
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: { stacked: true, grid: { display: false } },
    y: { stacked: true, beginAtZero: true, ticks: { precision: 0 } },
  },
  plugins: {
    legend: { position: 'bottom' },
  },
}
</script>

<template>
  <div>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

    <template v-else>
      <section class="summary-grid">
        <div
          v-for="card in summaryCards"
          :key="card.key"
          class="stat-card"
          :class="`tone-${card.tone}`"
        >
          <div class="stat-icon" aria-hidden="true">
            <svg v-if="card.icon === 'box'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 8 12 3 3 8l9 5 9-5Z" />
              <path d="M3 8v8l9 5 9-5V8" />
              <path d="M12 13v8" />
            </svg>
            <svg v-else-if="card.icon === 'check'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            <svg v-else-if="card.icon === 'alert'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
            <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 3" />
            </svg>
          </div>
          <p class="stat-value">{{ isLoading ? '—' : card.value }}</p>
          <p class="stat-label">{{ card.label }}</p>
        </div>
      </section>

      <section class="warehouse-section">
        <h2 class="section-title">Stock par entrepôt</h2>

        <div v-if="!isLoading && warehouseStats.length === 0" class="empty-state">
          <p>Aucun entrepôt pour l'instant.</p>
          <span>Crée un entrepôt pour voir apparaître sa répartition de stock ici.</span>
        </div>

        <div v-else class="chart-container">
          <Bar :data="chartData" :options="chartOptions" />
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background-color: #FFFFFF;
  border-radius: 10px;
  padding: 1.1rem 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  border-left: 4px solid #2F5D4E;
}

.stat-card.tone-warning {
  border-left-color: #B5502F;
}

.stat-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background-color: #FAF7F2;
  color: #2F5D4E;
  margin-bottom: 0.75rem;
}

.stat-card.tone-warning .stat-icon {
  color: #B5502F;
}

.stat-value {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: #232323;
  line-height: 1.1;
}

.stat-label {
  margin: 0.3rem 0 0;
  font-size: 0.85rem;
  color: #5a5a5a;
}

.section-title {
  margin: 0 0 1rem;
  font-size: 1.05rem;
  color: #232323;
}

.chart-container {
  background-color: #FFFFFF;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  height: 360px;
  box-sizing: border-box;
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

@media (max-width: 480px) {
  .summary-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>