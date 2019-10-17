import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the UtcConvertPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'utcConvert',
})
export class UtcConvertPipe implements PipeTransform {
  data: any = '';
  transform(value: any, args: any[]): any {
    if (!value) return value;
    this.data = value.replace(/-/g, "/");

    // convert UTC time to device time!
    // if (!value) return value;
    var date = new Date(this.data);
    return date.toString();;
  }
}
