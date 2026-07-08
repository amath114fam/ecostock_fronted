<script setup>
import { ref } from 'vue'
import { login } from '../services/authService.js'

const emit = defineEmits(['logged-in'])

const username = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

async function handleSubmit() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    await login(username.value, password.value)
    emit('logged-in')
  } catch (error) {
    errorMessage.value = 'Identifiants incorrects.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-brand">
        <span class="brand-mark" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9.5 12 3l9 6.5" />
            <path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" />
          </svg>
        </span>
        <span class="brand-name">Eco-Stock</span>
      </div>

      <form class="login-form" @submit.prevent="handleSubmit">
        <div class="form-heading">
          <h1>Connexion</h1>
          <p>Accédez à votre espace de gestion de stock</p>
        </div>

        <label class="field">
          <span class="field-label">Nom d'utilisateur</span>
          <input
            v-model="username"
            type="text"
            placeholder="Nom d'utilisateur"
            class="input-field"
            autocomplete="username"
          />
        </label>

        <label class="field">
          <span class="field-label">Mot de passe</span>
          <input
            v-model="password"
            type="password"
            placeholder="Mot de passe"
            class="input-field"
            autocomplete="current-password"
          />
        </label>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

        <button type="submit" class="btn-primary" :disabled="isLoading">
          {{ isLoading ? 'Connexion...' : 'Se connecter' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #FAF7F2;
  padding: 1.5rem;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.login-card {
  width: 100%;
  max-width: 380px;
  background-color: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  padding: 2rem 1.75rem;
  box-sizing: border-box;
}

.login-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.75rem;
}

.brand-mark {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background-color: #2F5D4E;
  color: #FFFFFF;
  flex-shrink: 0;
}

.brand-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: #2F5D4E;
  letter-spacing: -0.01em;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-heading {
  margin-bottom: 0.25rem;
}

.form-heading h1 {
  margin: 0;
  font-size: 1.35rem;
  color: #232323;
}

.form-heading p {
  margin: 0.25rem 0 0;
  font-size: 0.88rem;
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
  padding: 0.65rem 0.8rem;
  border: 1px solid #d8d3c9;
  border-radius: 6px;
  font-size: 0.9rem;
  box-sizing: border-box;
  width: 100%;
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
  padding: 0.7rem 1.25rem;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s ease;
  margin-top: 0.25rem;
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

@media (max-width: 420px) {
  .login-card {
    padding: 1.5rem 1.25rem;
  }
}
</style>