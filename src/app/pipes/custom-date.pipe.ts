import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';

@Pipe({
  name: 'customDate'
})
export class CustomDatePipe implements PipeTransform {

  transform(value: string | undefined | null, format: string = 'yyyy-MM-dd hh:mm:ss a'): string {
    if (!value) return '';
    return formatDate(value, format, 'en-GB');
  }

}
