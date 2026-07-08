<script setup>
const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  warehouseName: {
    type: String,
    default: '—',
  },
})

defineEmits(['close'])

// ⚠️ Mêmes valeurs ETAT supposées que dans CreateProductForm.vue — à garder synchronisées.
const ETAT_LABELS = {
  disponible: 'Disponible',
  rupture: 'Rupture de stock',
  perime: 'Périmé',
}

function etatLabel(value) {
  return ETAT_LABELS[value] || value
}

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
}
</script>

<template>
  <div class="details">
    <h2>{{ product.nom }}</h2>
    <span class="etat-badge" :class="`tone-${product.etat === 'disponible' ? 'positive' : 'warning'}`">
      {{ etatLabel(product.etat) }}
    </span>

    <dl class="details-list">
      <div class="details-row">
        <dt>Entrepôt</dt>
        <dd>{{ warehouseName }}</dd>
      </div>
      <div class="details-row">
        <dt>Quantité en stock</dt>
        <dd>{{ product.quantite }}</dd>
      </div>
      <div class="details-row">
        <dt>Etat</dt>
        <dd>{{ product.etat }}</dd>
      </div>
      <div class="details-row">
        <dt>Date d'expiration</dt>
        <dd>{{ formatDate(product.date_expiration) }}</dd>
      </div>
    </dl>

    <button type="button" class="btn-secondary" @click="$emit('close')">Fermer</button>
  </div>
</template>

<style scoped>
.details h2 {
  margin: 0 0 0.5rem;
  font-size: 1.15rem;
  color: #232323;
}

.etat-badge {
  display: inline-block;
  font-size: 0.78rem;
  font-weight: 600;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  margin-bottom: 1.25rem;
}

.etat-badge.tone-positive {
  color: #2F5D4E;
  background-color: #eaf1ee;
}

.etat-badge.tone-warning {
  color: #B5502F;
  background-color: #f7e9e3;
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