<script setup>
defineProps({
  activeView: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['change-view', 'logout'])
</script>

<template>
  <aside class="sidebar">
    <div class="brand">
      <span class="brand-mark" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9.5 12 3l9 6.5" />
          <path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" />
        </svg>
      </span>
      <span class="brand-name">Eco-Stock</span>
    </div>

    <ul class="nav-list">
      <li class="nav-item" :class="{ active: activeView === 'dashboard' }">
        <button type="button" @click="emit('change-view', 'dashboard')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="7" height="9" rx="1.5" />
            <rect x="14" y="3" width="7" height="5" rx="1.5" />
            <rect x="14" y="12" width="7" height="9" rx="1.5" />
            <rect x="3" y="16" width="7" height="5" rx="1.5" />
          </svg>
          <span>Tableau de Bord</span>
        </button>
      </li>
      <li class="nav-item" :class="{ active: activeView === 'entrepots' }">
        <button type="button" @click="emit('change-view', 'entrepots')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9.5 12 3l9 6.5" />
            <path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" />
          </svg>
          <span>Entrepôts</span>
        </button>
      </li>
      <li class="nav-item" :class="{ active: activeView === 'produits' }">
        <button type="button" @click="emit('change-view', 'produits')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 8 12 3 3 8l9 5 9-5Z" />
            <path d="M3 8v8l9 5 9-5V8" />
            <path d="M12 13v8" />
          </svg>
          <span>Produits</span>
        </button>
      </li>
    </ul>

    <div class="logout-item">
      <button type="button" @click="emit('logout')">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <path d="m16 17 5-5-5-5" />
          <path d="M21 12H9" />
        </svg>
        <span>Déconnexion</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 240px;
  flex-shrink: 0;
  min-height: 100vh;
  background-color: #FFFFFF;
  box-shadow: 1px 0 3px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1rem;
  box-sizing: border-box;
  position: sticky;
  top: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 0.5rem;
  margin-bottom: 2rem;
}

.brand-mark {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 7px;
  background-color: #2F5D4E;
  color: #FFFFFF;
  flex-shrink: 0;
}

.brand-name {
  font-size: 1.05rem;
  font-weight: 700;
  color: #2F5D4E;
  letter-spacing: -0.01em;
  white-space: nowrap;
}

.nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.nav-item button {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 0.75rem;
  border: none;
  background-color: transparent;
  border-radius: 8px;
  font-size: 0.92rem;
  font-family: inherit;
  color: #5a5a5a;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.nav-item button:hover {
  background-color: #FAF7F2;
  color: #2F5D4E;
}

.nav-item.active button {
  background-color: #2F5D4E;
  color: #FFFFFF;
  font-weight: 600;
}

.nav-item svg {
  flex-shrink: 0;
}

.logout-item {
  margin-top: auto;
  padding-top: 0.75rem;
  border-top: 1px solid #d8d3c9;
}

.logout-item button {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 0.75rem;
  border: none;
  background-color: transparent;
  border-radius: 8px;
  font-size: 0.92rem;
  font-family: inherit;
  color: #B5502F;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.logout-item button:hover {
  background-color: #B5502F;
  color: #FFFFFF;
}

/* Responsive: sidebar becomes a fixed bottom navigation bar on small screens */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    top: auto;
    width: 100%;
    min-height: auto;
    flex-direction: row;
    align-items: center;
    padding: 0.4rem 0.5rem;
    box-shadow: 0 -1px 6px rgba(0, 0, 0, 0.1);
    z-index: 20;
  }

  .brand {
    display: none;
  }

  .nav-list {
    flex-direction: row;
    flex: 1;
    justify-content: space-around;
    gap: 0;
  }

  .nav-item button {
    flex-direction: column;
    gap: 0.2rem;
    font-size: 0.68rem;
    padding: 0.4rem 0.6rem;
  }

  .logout-item {
    margin-top: 0;
    padding-top: 0;
    padding-left: 0.5rem;
    border-top: none;
    border-left: 1px solid #d8d3c9;
  }

  .logout-item button {
    flex-direction: column;
    gap: 0.2rem;
    font-size: 0.68rem;
    padding: 0.4rem 0.6rem;
  }
}
</style>