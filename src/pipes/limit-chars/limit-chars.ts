import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the LimitCharsPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'limitChars',
})
export class LimitCharsPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string,num:number) {

       value=value.length>num?value.substring(0,num)+'....':value;

    return value;
  }
}
