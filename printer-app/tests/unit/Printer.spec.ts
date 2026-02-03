import { describe, it, expect, beforeEach } from 'vitest'
import { Printer } from '@/domain/Printer'

describe('Printer Class', () => {
  let printer: Printer;

  beforeEach(() => {
    printer = new Printer('1', 'Test Printer');
  });

  it('должен менять статус на "печать" при запуске', () => {
    // Arrange (Подготовка)
    const modelId = 'm1';
    const plasticId = 'p1';

    // Act (Действие)
    printer.startPrint(modelId, plasticId);

    // Assert (Проверка)
    expect(printer.status).toBe('Printing');
  });

  it('должен выбрасывать ошибку, если модель не назначена', () => {
    expect(() => printer.startPrint(null, 'p1')).toThrow("Модель не назначена");
  });

  it('должен выбрасывать ошибку, если катушка не установлена', () => {
    expect(() => printer.startPrint('m1', null)).toThrow("Катушка не установлена");
  });

  it('не должен позволять снимать катушку во время печати', () => {
    printer.startPrint('m1', 'p1');
    expect(() => printer.removeFilament()).toThrow("Нельзя снять катушку во время печати");
  });
});