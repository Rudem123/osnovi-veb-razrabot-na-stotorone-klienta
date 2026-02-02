<script setup lang="ts">
import { usePrinterStore } from '@/stores/printerStore'
import { Printer } from '@/domain/Printer'

const store = usePrinterStore()

// 1. Установка пластика в принтер
function installPlastic(printer: Printer, plasticId: string) {
  printer.installedPlasticId = plasticId
  store.updatePrinter(printer)
}

// 2. ЗАПУСК ПЕЧАТИ (Основная логика)
async function startPrinting(printer: Printer, modelId: string) {
  const model = store.models.find(m => m.id === modelId)
  const plastic = store.plastics.find(p => p.id === printer.installedPlasticId)

  if (!model || !plastic) return

  // ТРЕБОВАНИЕ: Проверка нехватки пластика сразу
  if (plastic.length < model.gcodeSize) {
    alert(`Ошибка: Недостаточно пластика! Нужно ${model.gcodeSize}м, осталось ${plastic.length.toFixed(1)}м.`)
    return
  }

  // Подготовка
  printer.startPrint(model.id, plastic.id)
  model.status = 'Printing'
  model.printColor = plastic.color
  
  await store.updatePrinter(printer)
  await store.updateModel(model)

  // ИНТЕРВАЛ СИМУЛЯЦИИ
  const timer = setInterval(async () => {
    try {
      // ТРЕБОВАНИЕ: Бросок кубика на каждом шаге
      printer.checkHardwareHealth() // Если выпадет ошибка, она "выбросит" исключение (throw)

      // Если всё ок, увеличиваем прогресс
      printer.progress += 10 // +10% за шаг
      
      // Расход пластика (пропорционально прогрессу)
      const consumptionPerStep = model.gcodeSize * 0.1
      plastic.length -= consumptionPerStep

      // Проверка завершения
      if (printer.progress >= 100) {
        printer.progress = 100
        printer.status = 'Idle'
        model.status = 'Done'
        printer.currentModelId = null
        clearInterval(timer)
        alert(`Печать модели "${model.name}" успешно завершена!`)
      }

      // Сохраняем состояние на сервере
      await store.updatePrinter(printer)
      await store.updatePlastic(plastic)
      await store.updateModel(model)

    } catch (error: any) {
      // ТРЕБОВАНИЕ: Обработка ошибок (поломка)
      clearInterval(timer)
      printer.status = 'Error'
      printer.errorMessage = error.message
      model.status = 'Created' // Возвращаем модель в список созданных (печать прервана)
      
      await store.updatePrinter(printer)
      await store.updateModel(model)
    }
  }, 1000) // 1 шаг = 1 секунда
}
</script>

<template>
  <div class="home-grid">
    
    <!-- ЛЕВАЯ КОЛОНКА: ИНВЕНТАРЬ -->
    <div class="inventory">
      <h3>📦 Модели и Пластик</h3>
      
      <section>
        <h4>Доступные модели</h4>
        <div v-for="m in store.models.filter(x => x.status === 'Created')" :key="m.id" class="mini-card">
          📄 {{ m.name }} ({{ m.gcodeSize }}м)
        </div>
      </section>

      <section>
        <h4>Запас пластика</h4>
        <div v-for="p in store.plastics" :key="p.id" class="mini-card">
          <span class="dot" :style="{background: p.color}"></span>
          {{ p.type }} - {{ p.length.toFixed(1) }}м
        </div>
      </section>
    </div>

    <!-- ЦЕНТРАЛЬНАЯ ЧАСТЬ: ПРИНТЕРЫ -->
    <div class="printers-hub">
      <h3>🚀 Статус принтеров</h3>
      <div class="printer-container">
        <div v-for="printer in store.printers" :key="printer.id" class="p-card" :class="printer.status">
          <div class="icon">🖨️</div>
          <h4>{{ printer.name }}</h4>

          <!-- ВЫБОР ПЛАСТИКА -->
          <div v-if="printer.status === 'Idle'" class="controls">
            <select @change="installPlastic(printer, ($event.target as HTMLSelectElement).value)">
              <option :selected="!printer.installedPlasticId" disabled>Установить пластик...</option>
              <option v-for="p in store.plastics" :key="p.id" :value="p.id" :selected="p.id === printer.installedPlasticId">
                {{ p.color }} ({{ p.length.toFixed(1) }}м)
              </option>
            </select>

            <!-- ЗАПУСК ПЕЧАТИ -->
            <select v-if="printer.installedPlasticId" @change="startPrinting(printer, ($event.target as HTMLSelectElement).value)">
              <option selected disabled>Выбрать модель для печати...</option>
              <option v-for="m in store.models.filter(x => x.status === 'Created')" :key="m.id" :value="m.id">
                {{ m.name }} ({{ m.gcodeSize }}м)
              </option>
            </select>
          </div>

          <!-- ВИЗУАЛИЗАЦИЯ ПЕЧАТИ -->
          <div v-if="printer.status === 'Printing'" class="printing-info">
            <div class="progress-container">
              <div class="bar" :style="{ width: printer.progress + '%' }"></div>
            </div>
            <span>Печать: {{ printer.progress }}%</span>
          </div>

          <!-- СООБЩЕНИЕ ОБ ОШИБКЕ -->
          <div v-if="printer.status === 'Error'" class="error-msg">
            ⚠️ {{ printer.errorMessage }}
            <button @click="printer.status = 'Idle'; printer.errorMessage = null">Сброс</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.home-grid { display: grid; grid-template-columns: 300px 1fr; gap: 30px; }
.inventory { background: white; padding: 20px; border-radius: 12px; height: fit-content; }
.mini-card { padding: 8px; border-bottom: 1px solid #eee; font-size: 0.9rem; display: flex; align-items: center; gap: 10px; }
.dot { width: 10px; height: 10px; border-radius: 50%; }

.printer-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
.p-card { background: white; padding: 20px; border-radius: 15px; text-align: center; border: 2px solid transparent; transition: 0.3s; }
.p-card.Printing { border-color: #42b883; box-shadow: 0 0 15px rgba(66, 184, 131, 0.2); }
.p-card.Error { border-color: #ff6b6b; background: #fff5f5; }

.icon { font-size: 3rem; margin-bottom: 10px; }
.controls { display: flex; flex-direction: column; gap: 10px; }
select { width: 100%; }

.progress-container { background: #eee; height: 12px; border-radius: 6px; overflow: hidden; margin: 10px 0; }
.bar { background: #42b883; height: 100%; transition: width 0.3s; }

.error-msg { color: #e74c3c; font-weight: bold; margin-top: 10px; }
.error-msg button { display: block; margin: 10px auto; font-size: 0.7rem; }
</style>