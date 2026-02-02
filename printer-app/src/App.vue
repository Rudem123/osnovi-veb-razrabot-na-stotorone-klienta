<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { usePrinterStore } from '@/stores/printerStore'

// Сразу при запуске сайта просим Store загрузить данные
const store = usePrinterStore()

onMounted(() => {
  store.fetchAll()
})
</script>

<template>
  <div class="app-container">
    <!-- ШАПКА -->
    <header>
      <nav>
        <RouterLink to="/">Главная</RouterLink>
        <RouterLink to="/printers">Принтеры</RouterLink>
        <RouterLink to="/plastics">Пластики</RouterLink>
        <RouterLink to="/models">Модели</RouterLink>
      </nav>
    </header>

    <!-- ТЕЛО СТРАНИЦЫ (Сюда подставляются Home, Printers и т.д.) -->
    <main>
      <div v-if="store.loading" class="loading">Загрузка данных...</div>
      <div v-else-if="store.error" class="error">ОШИБКА: {{ store.error }}</div>
      
      <!-- Сама страница -->
      <RouterView v-else />
    </main>

    <!-- ПОДВАЛ -->
    <footer>
      <p>Студент: Фамилия И.О. | Группа: XXXX</p>
    </footer>
  </div>
</template>

<style scoped>
/* Простые стили, чтобы выглядело нормально */
header {
  background-color: #333;
  padding: 1rem;
}

nav {
  display: flex;
  gap: 20px;
}

nav a {
  color: white;
  text-decoration: none;
  font-size: 1.2rem;
}

nav a.router-link-active {
  color: #42b883; /* Зеленый цвет Vue для активной ссылки */
  font-weight: bold;
}

main {
  padding: 2rem;
  min-height: 60vh;
}

footer {
  background-color: #f4f4f4;
  padding: 1rem;
  text-align: center;
  margin-top: auto;
}

.error {
  color: red;
  font-weight: bold;
  border: 1px solid red;
  padding: 10px;
}
</style>