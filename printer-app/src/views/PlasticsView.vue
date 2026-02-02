<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePrinterStore } from '@/stores/printerStore'

const store = usePrinterStore()

// Данные для формы
const type = ref('')
const length = ref(100)
const color = ref('Black')

// Список разрешенных цветов по заданию
const availableColors = ['Black', 'White', 'Red', 'Blue', 'Green']

// Проверка: вставлен ли пластик в какой-либо принтер?
function isPlasticBusy(plasticId: string) {
  return store.printers.some(printer => printer.installedPlasticId === plasticId)
}

function handleAdd() {
  if (!type.value.trim() || length.value <= 0) {
    alert('Введите тип и корректную длину (больше 0)')
    return
  }
  store.addPlastic(type.value, color.value, length.value)
  type.value = ''
  length.value = 100
}

function handleDelete(id: string) {
  if (isPlasticBusy(id)) return; // Дополнительная защита
  if (confirm('Удалить этот пластик?')) {
    store.deletePlastic(id)
  }
}
</script>

<template>
  <div class="page">
    <h2>🧵 Управление пластиком</h2>

    <!-- Форма добавления -->
    <div class="add-form">
      <input v-model="type" placeholder="Марка пластика (PLA, PETG...)" />
      
      <div class="input-group">
        <label>Длина (м):</label>
        <input type="number" v-model.number="length" min="1" />
      </div>

      <div class="input-group">
        <label>Цвет:</label>
        <select v-model="color">
          <option v-for="c in availableColors" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>

      <button @click="handleAdd">Добавить</button>
    </div>

    <!-- Список -->
    <div v-if="store.plastics.length === 0" class="empty-msg">Пластика пока нет.</div>

    <div v-else class="list">
      <div v-for="p in store.plastics" :key="p.id" class="card">
        <div class="info">
          <!-- Маленький кружок с цветом для красоты -->
          <span class="color-dot" :style="{ backgroundColor: p.color.toLowerCase() }"></span>
          <h3>{{ p.type }} ({{ p.color }})</h3>
          <p>Остаток: <b>{{ p.length.toFixed(1) }} м</b></p>
        </div>

        <div class="actions">
          <button 
            v-if="!isPlasticBusy(p.id)" 
            @click="handleDelete(p.id)" 
            class="btn-delete"
          >
            Удалить
          </button>
          <span v-else class="locked-hint">🔒 Используется в принтере</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page { max-width: 800px; margin: 0 auto; }
.add-form { 
  display: flex; flex-wrap: wrap; gap: 15px; 
  background: white; padding: 20px; border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin-bottom: 30px;
  align-items: flex-end;
}
.input-group { display: flex; flex-direction: column; gap: 5px; }
.input-group label { font-size: 0.8rem; color: #666; }

.card {
  background: white; border-radius: 12px; padding: 15px 20px;
  margin-bottom: 10px; display: flex; justify-content: space-between;
  align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.info { display: flex; align-items: center; gap: 15px; }
.color-dot {
  width: 20px; height: 20px; border-radius: 50%; border: 1px solid #ddd;
}

.btn-delete { background-color: #ff6b6b; color: white; padding: 8px 16px; }
.locked-hint { color: #f39c12; font-weight: bold; font-size: 0.85rem; }
</style>