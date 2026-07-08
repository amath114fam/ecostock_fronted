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
  <form class="login-form" @submit.prevent="handleSubmit">
    <h2>Connexion</h2>

    <input
      v-model="username"
      type="text"
      placeholder="Nom d'utilisateur"
      class="input-field"
    />

    <input
      v-model="password"
      type="password"
      placeholder="Mot de passe"
      class="input-field"
    />

    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

    <button type="submit" class="btn-primary" :disabled="isLoading">
      {{ isLoading ? 'Connexion...' : 'Se connecter' }}
    </button>
  </form>
</template>

<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 320px;
  background-color: #FFFFFF;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  margin: 2rem auto;
}

.login-form h2 {
  margin: 0 0 0.5rem;
  font-size: 1.2rem;
  color: #2F5D4E;
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


.input-field {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d8d3c9;
  border-radius: 6px;
  font-size: 0.9rem;
}

.input-field:focus {
  outline: 2px solid #2F5D4E;
  outline-offset: 1px;
}

.error-message {
  color: #B5502F;
  font-size: 0.85rem;
  margin: 0;
}
</style>