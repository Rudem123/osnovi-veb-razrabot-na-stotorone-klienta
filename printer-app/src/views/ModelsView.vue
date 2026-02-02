<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePrinterStore } from '@/stores/printerStore'
import { Model3D } from '@/domain/Model'

const store = usePrinterStore()

// Данные для формы
const name = ref('')
const size = ref(10)

// Сортировка
const sortBy = ref<'name' | 'date'>('date')

// Функция добавления
function handleAdd() {
  if (!name.value.trim() || size.value <= 0) return alert('Заполните данные корректно')
  store.addModel(name.value, size.value)
  name.value = ''; size.value = 10;
}

// --- ЛОГИКА СОРТИРОВКИ ---
const sortedModels = computed(() => {
  return [...store.models].sort((a, b) => {
    if (sortBy.value === 'name') {
      return a.name.localeCompare(b.name)
    } else {
      // Сортировка по дате (новые сверху)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })
})

// Разделение моделей по группам для списков
const createdModels = computed(() => sortedModels.value.filter(m => m.status === 'Created'))
const printingModels = computed(() => sortedModels.value.filter(m => m.status === 'Printing'))
const doneModels = computed(() => sortedModels.value.filter(m => m.status === 'Done'))

// Форматирование даты для красоты
function formatDate(iso: string) {
  return new Date(iso).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <div class="page">
    <h2>🧊 Управление моделями</h2>

    <!-- Форма добавления -->
    <div class="add-form">
      <input v-model="name" placeholder="Название модели" />
      <div class="input-group">
        <label>Расход (м):</label>
        <input type="number" v-model.number="size" />
      </div>
      <button @click="handleAdd" class="btn-add">Создать</button>
    </div>

    <!-- Сортировка -->
    <div class="sort-controls">
      <span>Сортировать по: </span>
      <button :class="{active: sortBy === 'date'}" @click="sortBy = 'date'">Дате</button>
      <button :class="{active: sortBy === 'name'}" @click="sortBy = 'name'">Имени</button>
    </div>

    <div class="columns">
      <!-- КОЛОНКА 1: НОВЫЕ -->
      <div class="column">
        <h3>🆕 Созданные ({{ createdModels.length }})</h3>
        <div v-for="m in createdModels" :key="m.id" class="model-card">
          <div class="info">
            <h4>{{ m.name }}</h4>
            <p>Пластик: {{ m.gcodeSize }} м</p>
            <small>{{ formatDate(m.createdAt) }}</small>
          </div>
          <div class="actions">
            <button @click="store.copyModel(m)" title="Копировать">📋</button>
            <button @click="store.deleteModel(m.id)" class="btn-del">🗑️</button>
          </div>
        </div>
      </div>

      <!-- КОЛОНКА 2: В ПЕЧАТИ -->
      <div class="column">
        <h3>⏳ В печати ({{ printingModels.length }})</h3>
        <div v-for="m in printingModels" :key="m.id" 
             class="model-card border-colored" 
             :style="{ borderLeftColor: m.printColor || '#ccc' }">
          <h4>{{ m.name }}</h4>
          <p>Цвет: <b :style="{color: m.printColor || 'black'}">{{ m.printColor }}</b></p>
        </div>
      </div>

      <!-- КОЛОНКА 3: ГОТОВЫЕ -->
      <div class="column">
        <h3>✅ Готовые ({{ doneModels.length }})</h3>
        <div v-for="m in doneModels" :key="m.id" 
             class="model-card border-colored"
             :style="{ borderLeftColor: m.printColor || '#ccc' }">
          <h4>{{ m.name }}</h4>
          <p>Напечатано в цвете {{ m.printColor }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page { max-width: 1200px; margin: 0 auto; }
.add-form { 
  display: flex; gap: 15px; background: white; padding: 20px; 
  border-radius: 12px; margin-bottom: 20px; align-items: flex-end;
}
.sort-controls { margin-bottom: 20px; display: flex; gap: 10px; align-items: center; }
.sort-controls button { padding: 5px 15px; background: #ddd; }
.sort-controls button.active { background: #42b883; color: white; }

.columns { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }
.column { background: #ebedef; padding: 15px; border-radius: 12px; min-height: 400px; }
.column h3 { font-size: 1.1rem; margin-bottom: 15px; color: #444; }

.model-card { 
  background: white; padding: 12px; border-radius: 8px; margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  display: flex; justify-content: space-between; align-items: center;
}
.border-colored { border-left: 6px solid #ccc; }

.info h4 { margin: 0; font-size: 1rem; }
.info p { margin: 2px 0; font-size: 0.85rem; color: #666; }
.info small { font-size: 0.7rem; color: #999; }

.actions { display: flex; gap: 5px; }
.actions button { background: #eee; padding: 5px 8px; font-size: 1rem; }
.btn-del:hover { background: #ff6b6b; color: white; }
.btn-add { background: #42b883; color: white; }
</style>