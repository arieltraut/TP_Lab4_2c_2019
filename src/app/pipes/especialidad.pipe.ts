import { Pipe, PipeTransform } from '@angular/core';
import { TurnoInterface } from '../classes/turno';

@Pipe({
  name: 'especialidad'
})
export class EspecialidadPipe implements PipeTransform {

  transform(type: string, especialidad: string): string {
    if (type === 'Especialista') {
      switch (especialidad) {
        case 'Radiologia': {
          return 'Radiologo';
          break;
        }
        case 'Cariologia': {
          return 'Cariologo';
          break;
        }
        case 'Ortodoncia': {
          return 'Ortodoncista';
          break;
        }
        case 'Implantologia': {
          return 'Implantologo';
          break;
        }
      }
    }
    return type;
  }
}
