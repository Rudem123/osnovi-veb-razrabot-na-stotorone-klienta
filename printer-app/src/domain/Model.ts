// src/domain/Model.ts

export class Model3D {
    id: string;
    name: string;
    gcodeSize: number; // Сколько метров пластика нужно
    createdAt: string;
    
    // Статус модели: Created (создана), Printing (печатается), Done (готова)
    status: 'Created' | 'Printing' | 'Done'; 
    
    // Каким цветом напечатали (заполним после печати)
    printColor: string | null = null;
  
    constructor(id: string, name: string, gcodeSize: number) {
      this.id = id;
      this.name = name;
      this.gcodeSize = gcodeSize;
      this.createdAt = new Date().toISOString();
      this.status = 'Created';
    }
  }