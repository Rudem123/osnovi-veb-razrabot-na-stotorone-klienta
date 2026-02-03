// src/domain/Printer.ts
import { FilamentBreakError, OverheatError, DetachmentError } from './PrinterErrors';

// Возможные состояния принтера
export type PrinterStatus = 'Idle' | 'Printing' | 'Error';

export class Printer {
  id: string;
  name: string;
  status: PrinterStatus = 'Idle';
  
  installedPlasticId: string | null = null; // ID вставленного пластика
  currentModelId: string | null = null;     // ID модели, которая печатается
  
  progress: number = 0;           // Прогресс 0..100%
  errorMessage: string | null = null; // Текст ошибки, если сломался

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  // --- МЕТОД: Бросок кубика (проверка на поломку) ---
  checkHardwareHealth(): void {
    // Генерируем случайное число от 0.0 до 1.0
    const dice = Math.random(); 
    
    // Допустим, шанс поломки 3% на каждом шаге (0.03)
    if (dice < 0.03) {
      this.status = 'Error';
      
      // Второй бросок: какая именно ошибка?
      const errorType = Math.random();
      
      if (errorType < 0.33) {
        this.errorMessage = "Обрыв нити пластика";
        throw new FilamentBreakError();
      } else if (errorType < 0.66) {
        this.errorMessage = "Перегрев принтера";
        throw new OverheatError();
      } else {
        this.errorMessage = "Модель отклеилась";
        throw new DetachmentError();
      }
    }
  }

  // Начать печать
  startPrint(modelId: string | null, plasticId: string | null) {
    if (!modelId) throw new Error("Модель не назначена");
    if (!plasticId) throw new Error("Катушка не установлена");
    
    this.status = 'Printing';
    this.currentModelId = modelId;
    this.installedPlasticId = plasticId;
    this.progress = 0;
  }
  
  // Добавь методы установки/снятия для тестов
  installFilament(plasticId: string) {
    if (this.installedPlasticId) throw new Error("Катушка уже установлена");
    this.installedPlasticId = plasticId;
  }
  
  removeFilament() {
    if (this.status === 'Printing') throw new Error("Нельзя снять катушку во время печати");
    this.installedPlasticId = null;
  }

  // Остановить печать (успех или ошибка)
  stopPrint() {
    this.status = 'Idle';
    this.currentModelId = null;
    this.progress = 0;
  }
}