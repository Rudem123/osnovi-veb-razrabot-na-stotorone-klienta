import { describe, it, expect } from 'vitest'
import { Model3D } from '@/domain/Model'

describe('Model Class', () => {
  it('правильно инициализирует модель со всеми необходимыми полями', () => {
    // Arrange & Act
    const model = new Model3D('m1', 'Super Cube', 45)

    // Assert (проверяем все поля по заданию)
    expect(model.id).toBe('m1')
    expect(model.name).toBe('Super Cube')
    expect(model.gcodeSize).toBe(45)
    expect(model.status).toBe('Created')
    expect(model.createdAt).toBeDefined() // Дата должна быть создана
    expect(model.printColor).toBeNull()   // Изначально цвета нет
  })
})