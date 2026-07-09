<script setup>
defineProps({
  warehouse: {
    type: Object,
    required: true,
  },
})

defineEmits(['close'])
</script>

<template>
  <div class="details">
    <h2>{{ warehouse.nom }}</h2>

    <dl class="details-list">
      <div class="details-row">
        <dt>Localisation</dt>
        <dd>{{ warehouse.localisation || '—' }}</dd>
      </div>
      <div class="details-row">
        <dt>Capacité</dt>
        <dd>{{ warehouse.capacite ?? '—' }}</dd>
      </div>
    </dl>

    <button type="button" class="btn-secondary" @click="$emit('close')">Fermer</button>
  </div>
</template>

<style scoped>
.details h2 {
  margin: 0 0 1.25rem;
  font-size: 1.15rem;
  color: #232323;
}

.details-list {
  margin: 0 0 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.details-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #d8d3c9;
}

.details-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.details-row dt {
  margin: 0;
  font-size: 0.85rem;
  color: #5a5a5a;
}

.details-row dd {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: #232323;
  text-align: right;
}

.btn-secondary {
  width: 100%;
  background-color: transparent;
  border: 1px solid #2F5D4E;
  color: #2F5D4E;
  padding: 0.6rem 1.1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.btn-secondary:hover {
  background-color: #2F5D4E;
  color: #FFFFFF;
}
</style>