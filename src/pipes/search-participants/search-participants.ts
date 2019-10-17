import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the SearchParticipantsPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'searchParticipants',
})
export class SearchParticipantsPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
   transform(list:any[],searchTerm:string):any[]{
     if(searchTerm)
     {
       return list.filter(item=>{
         if(item.userName.toLowerCase().indexOf(searchTerm.toLowerCase())!=-1)
         {
             return item.userName.toLowerCase().indexOf(searchTerm.toLowerCase())!=-1
         }
       });
     }
     else
     return list;
   }
}
