import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Printer } from '@/domain/Printer'
import { Plastic } from '@/domain/Plastic'
import { Model3D } from '@/domain/Model'

export const usePrinterStore = defineStore('printerStore', () => {
  // === СОСТОЯНИЕ (Где храним данные) ===
  const printers = ref<Printer[]>([])
  const plastics = ref<Plastic[]>([])
  const models = ref<Model3D[]>([])
  
  const loading = ref(false) // Загружается ли сейчас?
  const error = ref<string | null>(null) // Текст ошибки, если сервер упал

  const API_URL = 'http://localhost:3001'

  // === ДЕЙСТВИЯ (Actions) ===

  // 1. Загрузить всё с сервера
  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      // Запрашиваем данные параллельно
      const [resPrinters, resPlastics, resModels] = await Promise.all([
        fetch(`${API_URL}/printers`),
        fetch(`${API_URL}/plastics`),
        fetch(`${API_URL}/models`)
      ])

      // Если что-то не скачалось -> ошибка
      if (!resPrinters.ok || !resPlastics.ok || !resModels.ok) {
        throw new Error('Ошибка подключения к серверу JSON')
      }

      const rawPrinters = await resPrinters.json()
      const rawPlastics = await resPlastics.json()
      const rawModels = await resModels.json()

      // ПРЕВРАЩАЕМ JSON ОБРАТНО В КЛАССЫ
      // (Object.assign копирует свойства из JSON в новый объект класса)
      
      printers.value = rawPrinters.map((p: any) => 
        Object.assign(new Printer(p.id, p.name), p)
      )

      plastics.value = rawPlastics.map((p: any) => 
        new Plastic(p.id, p.type, p.color, p._length)
      )

      models.value = rawModels.map((m: any) => 
        Object.assign(new Model3D(m.id, m.name, m.gcodeSize), m)
      )

    } catch (err: any) {
      error.value = err.message
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  // 2. Сохранить изменения принтера (например, прогресс печати)
  async function updatePrinter(printer: Printer) {
    try {
      await fetch(`${API_URL}/printers/${printer.id}`, {
        method: 'PUT', // Обновление
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(printer)
      })
    } catch (e) {
      console.error("Не удалось сохранить принтер", e)
    }
  }

  // 3. Добавить новый принтер
  async function addPrinter(name: string) {
    const newPrinter = new Printer(crypto.randomUUID(), name)
    
    // Сначала в базу
    const res = await fetch(`${API_URL}/printers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPrinter)
    })

    // Если ок, добавляем к себе в список
    if (res.ok) {
      printers.value.push(newPrinter)
    }
  }

  // 4. Удалить принтер
  async function deletePrinter(id: string) {
    await fetch(`${API_URL}/printers/${id}`, { method: 'DELETE' })
    // Удаляем из локального списка
    printers.value = printers.value.filter(p => p.id !== id)
  }
  
  // Аналогичные методы нужны будут для пластика и моделей (сделаем позже при необходимости)

  return { 
    printers, plastics, models, loading, error, // variables
    fetchAll, updatePrinter, addPrinter, deletePrinter // functions
  }
})