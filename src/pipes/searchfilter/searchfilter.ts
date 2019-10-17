import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the SearchfilterPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'searchfilter',
  pure : true
})
export class SearchfilterPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(list: any[], searchTerm: string): any[] {
    var str = "";
    var searchstr = searchTerm['str'];
    var strtype = searchTerm['str2'];

    console.log(searchstr);
    searchstr = searchstr.toLowerCase();

    if (searchstr) {

      if(strtype == 'conv'){
       
        return list.filter(item => {
          if(item.convoName != undefined){
            str = item.convoName.toLowerCase();
            console.log(str);
           if(str.indexOf(searchstr) !== -1){
              return str.indexOf(searchstr) !== -1;
           }
         }
        });

      }else if(strtype == 'nonconv'){
          return list.filter(item => {
          if(item.converationName != undefined){
            str =item.converationName.toLowerCase();
            console.log(str);
            if(str.indexOf(searchstr) !== -1){
              return str.indexOf(searchstr) !== -1;
          }
          }
        });
      }
      
     
     } else {
       return list;
     }
 }
}
