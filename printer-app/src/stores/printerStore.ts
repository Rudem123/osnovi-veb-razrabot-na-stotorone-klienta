import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Printer } from '@/domain/Printer'
import { Plastic } from '@/domain/Plastic'
import { Model3D } from '@/domain/Model'

export const usePrinterStore = defineStore('printerStore', () => {
  const printers = ref<Printer[]>([])
  const plastics = ref<Plastic[]>([])
  const models = ref<Model3D[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const API_URL = 'http://localhost:3001'

  // 1. Загрузить всё
  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      const [resP, resPl, resM] = await Promise.all([
        fetch(`${API_URL}/printers`),
        fetch(`${API_URL}/plastics`),
        fetch(`${API_URL}/models`)
      ])
      if (!resP.ok || !resPl.ok || !resM.ok) throw new Error('Ошибка сервера')
      
      const dataP = await resP.json()
      const dataPl = await resPl.json()
      const dataM = await resM.json()

      printers.value = dataP.map((p: any) => Object.assign(new Printer(p.id, p.name), p))
      plastics.value = dataPl.map((p: any) => new Plastic(p.id, p.type, p.color, p._length))
      models.value = dataM.map((m: any) => Object.assign(new Model3D(m.id, m.name, m.gcodeSize), m))
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  // 2. Методы для Принтеров
  async function addPrinter(name: string) {
    const newP = new Printer(crypto.randomUUID(), name)
    const res = await fetch(`${API_URL}/printers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newP)
    })
    if (res.ok) printers.value.push(newP)
  }

  async function updatePrinter(printer: Printer) {
    await fetch(`${API_URL}/printers/${printer.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(printer)
    })
  }

  async function deletePrinter(id: string) {
    await fetch(`${API_URL}/printers/${id}`, { method: 'DELETE' })
    printers.value = printers.value.filter(p => p.id !== id)
  }

  // 3. Методы для Пластика
  async function addPlastic(type: string, color: string, length: number) {
    const newPl = new Plastic(crypto.randomUUID(), type, color, length)
    const res = await fetch(`${API_URL}/plastics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPl)
    })
    if (res.ok) plastics.value.push(newPl)
  }

  async function updatePlastic(plastic: Plastic) {
    await fetch(`${API_URL}/plastics/${plastic.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plastic)
    })
  }

  async function deletePlastic(id: string) {
    await fetch(`${API_URL}/plastics/${id}`, { method: 'DELETE' })
    plastics.value = plastics.value.filter(p => p.id !== id)
  }

  // 4. Методы для Моделей
  async function addModel(name: string, size: number) {
    const newM = new Model3D(crypto.randomUUID(), name, size)
    const res = await fetch(`${API_URL}/models`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newM)
    })
    if (res.ok) models.value.push(newM)
  }

  async function updateModel(model: Model3D) {
    await fetch(`${API_URL}/models/${model.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(model)
    })
  }

  async function deleteModel(id: string) {
    await fetch(`${API_URL}/models/${id}`, { method: 'DELETE' })
    models.value = models.value.filter(m => m.id !== id)
  }

  async function copyModel(model: Model3D) {
    await addModel(`${model.name} (копия)`, model.gcodeSize)
  }

  // ВАЖНО: Тут все через запятую!
  return {
    printers, plastics, models, loading, error,
    fetchAll, 
    addPrinter, updatePrinter, deletePrinter,
    addPlastic, updatePlastic, deletePlastic,
    addModel, updateModel, deleteModel, copyModel
  }
})