<script setup>
import { ref } from 'vue'
import LoginForm from './components/LoginForm.vue'
import Sidebar from './components/Sidebar.vue'
import DashboardHome from './components/DashboardHome.vue'
import WarehouseList from './components/WarehouseList.vue'
import CreateWarehouseForm from './components/CreateWarehouseForm.vue'
import ProductList from './components/ProductList.vue'
import CreateProductForm from './components/CreateProductForm.vue'
import { getAccessToken, logout } from './services/authService.js'

const isAuthenticated = ref(!!getAccessToken())
const activeView = ref('dashboard') // 'dashboard' | 'entrepots' | 'produits'
const showForm = ref(false)
const warehouseListKey = ref(0)
const productListKey = ref(0)
const warehouseSearch = ref('')
const productSearch = ref('')

// Gère l'événement de connexion réussie
function handleLoggedIn() {
  isAuthenticated.value = true
}

// Gère la déconnexion de l'utilisateur
function handleLogout() {
  logout()
  isAuthenticated.value = false
}
// Change la vue active dans le tableau de bord
function changeView(view) {
  activeView.value = view
  showForm.value = false
}

// Bascule l'affichage du formulaire
function toggleForm() {
  showForm.value = !showForm.value
}

// Gère la création d'un nouvel entrepôt
function handleWarehouseCreated() {
  showForm.value = false
  warehouseListKey.value++
}

// Gère la création d'un nouveau produit
function handleProductCreated() {
  showForm.value = false
  productListKey.value++
}
</script>

<template>
  <LoginForm v-if="!isAuthenticated" @logged-in="handleLoggedIn" />

  <div v-else class="dashboard">
    <Sidebar :active-view="activeView" @change-view="changeView" @logout="handleLogout" />

    <div class="dashboard-content">
      <div class="mobile-topbar">
        <span class="brand-mark" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9.5 12 3l9 6.5" />
            <path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" />
          </svg>
        </span>
        <span>Eco-Stock</span>
      </div>

      <header class="content-header">
        <div>
          <h1>
            {{
              activeView === 'dashboard'
                ? 'Tableau de Bord'
                : activeView === 'entrepots'
                  ? 'Entrepôts'
                  : 'Produits'
            }}
          </h1>
          <p class="content-subtitle">
            {{
              activeView === 'dashboard'
                ? "Vue d'ensemble de votre stock"
                : activeView === 'entrepots'
                  ? 'Gérez vos entrepôts et leur capacité'
                  : 'Gérez votre catalogue de produits'
            }}
          </p>
        </div>

        <div v-if="activeView === 'entrepots' && !showForm" class="header-search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            v-model="warehouseSearch"
            type="text"
            placeholder="Rechercher un entrepôt..."
            class="search-input"
          />
          <button
            v-if="warehouseSearch"
            type="button"
            class="search-clear"
            aria-label="Effacer la recherche"
            @click="warehouseSearch = ''"
          >
            ✕
          </button>
        </div>

        <button v-if="activeView !== 'dashboard'" class="btn-add" @click="toggleForm">
          {{
            showForm
              ? 'Annuler'
              : activeView === 'entrepots'
                ? '+ Ajouter un entrepôt'
                : '+ Ajouter un produit'
          }}
        </button>
      </header>

      <main class="content-body">
        <DashboardHome v-if="activeView === 'dashboard'" />

        <template v-else-if="activeView === 'entrepots'">
          <CreateWarehouseForm v-if="showForm" @saved="handleWarehouseCreated" />
          <WarehouseList v-else :key="warehouseListKey" :search="warehouseSearch" />
        </template>

        <template v-else>
          <div class="header-search product-search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              v-model="productSearch"
              type="text"
              placeholder="Rechercher un produit..."
              class="search-input"
            />
            <button
              v-if="productSearch"
              type="button"
              class="search-clear"
              aria-label="Effacer la recherche"
              @click="productSearch = ''"
            >
              ✕
            </button>
          </div>
          <CreateProductForm v-if="showForm" @saved="handleProductCreated" />
          <ProductList v-else :key="productListKey" :search="productSearch" />
        </template>
      </main>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  min-height: 100vh;
  background-color: #FAF7F2;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.dashboard-content {
  flex: 1;
  min-width: 0;
  padding: 2rem 2.5rem;
  box-sizing: border-box;
}

.mobile-topbar {
  display: none;
}

.content-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.75rem;
}

.content-header h1 {
  margin: 0;
  font-size: 1.5rem;
  color: #232323;
}

.content-subtitle {
  margin: 0.25rem 0 0;
  font-size: 0.9rem;
  color: #5a5a5a;
}

.header-search {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #FFFFFF;
  border: 1px solid #d8d3c9;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  flex: 1;
  min-width: 200px;
  max-width: 320px;
  color: #5a5a5a;
}

.header-search:focus-within {
  border-color: #2F5D4E;
  outline: 2px solid #2F5D4E;
  outline-offset: 1px;
}

.header-search svg {
  flex-shrink: 0;
}

.search-input {
  border: none;
  outline: none;
  background: transparent;
  font-size: 0.9rem;
  font-family: inherit;
  color: #232323;
  width: 100%;
}

.search-clear {
  border: none;
  background: transparent;
  color: #5a5a5a;
  cursor: pointer;
  font-size: 0.8rem;
  line-height: 1;
  padding: 0.15rem;
  flex-shrink: 0;
}

.search-clear:hover {
  color: #B5502F;
}

.btn-add {
  background-color: #2F5D4E;
  color: #FFFFFF;
  border: none;
  padding: 0.65rem 1.15rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.15s ease;
}

.btn-add:hover {
  background-color: #264a3e;
}

.product-search {
  margin-bottom: 1.25rem;
}

@media (max-width: 768px) {
  .dashboard {
    flex-direction: column;
  }

  .dashboard-content {
    padding: 1.25rem 1.25rem 5rem;
  }

  .mobile-topbar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1rem;
    font-weight: 700;
    color: #2F5D4E;
    margin-bottom: 1.25rem;
  }

  .mobile-topbar .brand-mark {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border-radius: 6px;
    background-color: #2F5D4E;
    color: #FFFFFF;
    flex-shrink: 0;
  }

  .content-header {
    margin-bottom: 1.25rem;
  }

  .header-search {
    max-width: none;
    order: 3;
    flex-basis: 100%;
  }

  .btn-add {
    width: 100%;
  }
}
</style>