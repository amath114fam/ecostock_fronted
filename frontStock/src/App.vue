<script setup>
import { ref } from 'vue'
import LoginForm from './components/LoginForm.vue'
import WarehouseList from './components/WarehouseList.vue'
import CreateWarehouseForm from './components/CreateWarehouseForm.vue'
import { getAccessToken, logout } from './services/authService.js'

function handleLogout() {
  logout()
  isAuthenticated.value = false
}

const isAuthenticated = ref(!!getAccessToken())

function handleLoggedIn() {
  isAuthenticated.value = true
}
</script>

<template>
  <LoginForm v-if="!isAuthenticated" @logged-in="handleLoggedIn" />

  <div v-else class="app-layout">
    <header class="app-header">
      <h1>Eco-Stock</h1>
      <button class="btn-logout" @click="handleLogout">Se déconnecter</button>
    </header>

    <div class="content-grid">
      <aside class="sidebar">
        <CreateWarehouseForm />
      </aside>
      <section class="main-content">
        <WarehouseList ref="warehouseListRef" />
      </section>
    </div>
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  background-color: #FAF7F2;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background-color: #FFFFFF;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.app-header h1 {
  font-size: 1.3rem;
  color: #2F5D4E;
  margin: 0;
}

.btn-logout {
  background-color: transparent;
  border: 1px solid #B5502F;
  color: #B5502F;
  padding: 0.4rem 0.9rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.btn-logout:hover {
  background-color: #B5502F;
  color: #FFFFFF;
}

.content-grid {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 1.5rem;
  align-items: start;
}

@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>