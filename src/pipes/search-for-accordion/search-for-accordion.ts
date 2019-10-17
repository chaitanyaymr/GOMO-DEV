import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the SearchForAccordionPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'searchForAccordion',
})
export class SearchForAccordionPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(list:any[],searchTerm:string) {
    if(searchTerm)
    {
      searchTerm=searchTerm.toUpperCase();
      return list.filter(item=>{
       if(item.formTitle.toUpperCase().indexOf(searchTerm)!=-1)
         return item.formTitle.toUpperCase().indexOf(searchTerm)!=-1

      });
    }
    else
    return list;
  }
}
