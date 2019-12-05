import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toUpperCase'
})
export class ToUpperCasePipe implements PipeTransform {

  transform(estado: string): string {
    return estado.toUpperCase();
  }

}
