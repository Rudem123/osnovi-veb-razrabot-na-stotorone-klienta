import { describe, it, expect } from 'vitest'
import { Plastic } from '@/domain/Plastic'

describe('Plastic Class', () => {
  it('правильно инициализирует длину', () => {
    // Arrange & Act
    const plastic = new Plastic('1', 'PLA', 'Red', 250)
    // Assert
    expect(plastic.length).toBe(250)
  })

  it('правильно рассчитывает остаток после расхода', () => {
    const plastic = new Plastic('1', 'PLA', 'Red', 100)
    plastic.length -= 40
    expect(plastic.length).toBe(60)
  })

  it('не позволяет установить отрицательную длину (валидация)', () => {
    const plastic = new Plastic('1', 'PLA', 'Red', 100)
    plastic.length = -50
    expect(plastic.length).toBe(0) // Наш сеттер должен превращать минус в 0
  })
})