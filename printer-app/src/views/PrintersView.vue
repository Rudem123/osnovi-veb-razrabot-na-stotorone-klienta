<script setup lang="ts">
import { ref } from 'vue'
import { usePrinterStore } from '@/stores/printerStore'

// 1. Подключаем наше Хранилище (где лежат данные)
const store = usePrinterStore()

// 2. Переменная для поля ввода (куда пишем имя нового принтера)
const newPrinterName = ref('')

// 3. Функция добавления
function handleAdd() {
  // Если имя пустое — ничего не делаем
  if (!newPrinterName.value.trim()) return;

  // Вызываем метод из Store
  store.addPrinter(newPrinterName.value);
  
  // Очищаем поле ввода
  newPrinterName.value = '';
}

// 4. Функция удаления
function handleDelete(id: string) {
  if (confirm('Вы уверены, что хотите удалить принтер?')) {
    store.deletePrinter(id);
  }
}
</script>

<template>
  <div class="page">
    <h2>🖨️ Управление принтерами</h2>

    <!-- ФОРМА ДОБАВЛЕНИЯ -->
    <div class="add-form">
      <input 
        v-model="newPrinterName" 
        placeholder="Название нового принтера" 
        @keyup.enter="handleAdd"
      />
      <button @click="handleAdd">Добавить</button>
    </div>

    <!-- ЕСЛИ СПИСОК ПУСТ -->
    <div v-if="store.printers.length === 0" class="empty-msg">
      Список принтеров пуст. Добавьте первый!
    </div>

    <!-- СПИСОК ПРИНТЕРОВ -->
    <div v-else class="printer-list">
      <div 
        v-for="printer in store.printers" 
        :key="printer.id" 
        class="card"
        :class="{ 'busy': printer.status !== 'Idle', 'error': printer.status === 'Error' }"
      >
        <div class="info">
          <h3>{{ printer.name }}</h3>
          <p>Статус: <b>{{ printer.status }}</b></p>
          <!-- Показываем прогресс, если печатает -->
          <p v-if="printer.status === 'Printing'">Прогресс: {{ printer.progress }}%</p>
          <p v-if="printer.errorMessage" class="error-text">Ошибка: {{ printer.errorMessage }}</p>
        </div>

        <div class="actions">
          <!-- Кнопка удаления (Активна ТОЛЬКО если статус 'Idle' - Простой) -->
          <button 
            v-if="printer.status === 'Idle'" 
            @click="handleDelete(printer.id)"
            class="btn-delete"
          >
            Удалить
          </button>
          
          <span v-else class="locked-hint">
            ⛔ Нельзя удалить (Занят)
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  max-width: 800px; /* Чуть шире */
  margin: 0 auto;
}

h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 20px;
}

/* Форма добавления */
.add-form {
  display: flex;
  gap: 10px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05); /* Легкая тень */
  margin-bottom: 30px;
}

input {
  flex: 1; /* Растягиваем поле на всю ширину */
}

.add-form button {
  background-color: #42b883; /* Зеленый Vue */
  color: white;
  padding: 0 20px;
}

/* Карточка принтера */
.card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between; /* Разносим текст и кнопку по краям */
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-2px); /* Чуть всплывает при наведении */
}

/* Статусы */
.card.busy {
  border-left: 6px solid #f39c12; /* Оранжевая полоска */
}
.card.error {
  border-left: 6px solid #e74c3c; /* Красная полоска */
  background-color: #fff5f5;
}

.card h3 {
  margin: 0 0 5px 0;
  color: #2c3e50;
}

.card p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

/* Кнопка удаления */
.btn-delete {
  background-color: #ff6b6b;
  color: white;
  padding: 8px 16px;
}

.locked-hint {
  color: #95a5a6;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 5px;
}

.error-text {
  color: #e74c3c;
  font-weight: bold;
}
</style>