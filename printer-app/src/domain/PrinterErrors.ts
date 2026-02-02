// src/domain/PrinterErrors.ts

// Базовый класс ошибки принтера
export class PrinterError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "PrinterError";
    }
  }
  
  // Конкретные ошибки (как просили в задании)
  export class FilamentBreakError extends PrinterError {
    constructor() { super("Обрыв нити пластика"); }
  }
  
  export class OverheatError extends PrinterError {
    constructor() { super("Перегрев принтера"); }
  }
  
  export class DetachmentError extends PrinterError {
    constructor() { super("Модель отклеилась от стола"); }
  }