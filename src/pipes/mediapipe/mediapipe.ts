import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the MediapipePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'mediapipe',
})
export class MediapipePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  data: any = '';
  transform(value: any, args: any[]):any {
    if (!value) return value;
    let result="";
    this.data = value.replace(/-/g, "/");

    // convert UTC time to device time!
    // if (!value) return value;
    var date = new Date(this.data);
    //return date.toString();
    var days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
   var today=new Date();
   if(date.getFullYear()==today.getFullYear())
   {
     if(date.getMonth()==today.getMonth())
     {
          var d1=date.getDate();
          var d2=today.getDate();
          var diff=d2-d1;
           if(diff==0)
           result=this.formatime(date)
          else if(diff==1)
            result="Yesterday" +"@ "+this.formatime(date);
          else if(diff>1&&diff<7)
            result=days[date.getDay()] +" @ "+this.formatime(date);
          else
            result=this.formatDate(date) +" @ "+this.formatime(date);
     }
     else
     {
      result=this.formatDate(date)+" @ "+this.formatime(date);
     }
   }
   else
   {
    result=this.formatDate(date)+" @ "+this.formatime(date);
   }
  return result;
  }
  formatDate(dt)
  {
    var d=new Date(dt);
    let month:any=d.getMonth()+1;
    month=month<10?'0'+month:month;
    let day:any=d.getDate();
    day=day<10?'0'+day:day;
    return month+'.'+day+'.'+d.getFullYear();
  }

  formatime(dt)
  {
    console.log('time Formate'+dt)
     var tm=new Date(dt);
     var apm=tm.getHours()>=12?"PM":"AM";
      let hr:any=tm.getHours()%12;
      console.log('Hours : '+hr)
        hr=hr?hr:12;
        hr=hr<10?'0'+hr:hr;
      let mn:any=tm.getMinutes()<10?'0'+tm.getMinutes():tm.getMinutes();
      return hr+":"+mn+" "+apm;
  }
}
