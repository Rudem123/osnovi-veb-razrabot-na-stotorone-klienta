// src/domain/Plastic.ts

export class Plastic {
    id: string;
    type: string;
    color: string;
    private _length: number; // Приватное поле
  
    constructor(id: string, type: string, color: string, length: number) {
      this.id = id;
      this.type = type;
      this.color = color;
      this._length = length;
    }
  
    // Геттер (получить значение)
    get length(): number {
      return this._length;
    }
  
    // Сеттер (записать значение с проверкой)
    set length(value: number) {
      if (value < 0) {
        // Защита от отрицательных чисел
        this._length = 0; 
      } else {
        this._length = value;
      }
    }
  }