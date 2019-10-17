import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the SearchDataByTermPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'searchDataByTerm',
})
export class SearchDataByTermPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(list: any[], searchTerm: string): any[] {
    if (searchTerm) {
       searchTerm = searchTerm.toUpperCase();
       return list.filter(item => {
          if(item.converationName.toUpperCase().indexOf(searchTerm) !== -1){
             return item.converationName.toUpperCase().indexOf(searchTerm) !== -1;
          }else if(item.converationDesignation.toUpperCase().indexOf(searchTerm) !== -1){
             return item.converationDesignation.toUpperCase().indexOf(searchTerm) !== -1;
          }      
       });
     } else {
       return list;
     }
 }
}
