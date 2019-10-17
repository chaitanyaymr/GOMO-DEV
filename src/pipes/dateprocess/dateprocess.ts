import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the DateprocessPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'dateprocess',
})
export class DateprocessPipe implements PipeTransform {
  data: any = '';
  transform(value: any, args: any[]): any {
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
          let d1=date.getDate();
          let d2=today.getDate();
          let diff=d2-d1;
           if(diff==0)
           result="Today"
          else if(diff==1)
            result="Yesterday";
          else if(diff>1&&diff<7)
            result=days[date.getDay()];
          else
            result=this.formatDate(date);
     }
     else if(date.getMonth()-today.getMonth()==-1)
     {
       let month=date.getMonth()+1;
       let d1=date.getDate();
       let d2=today.getDate();
       let diff=Math.abs(d2-d1);
       let no_days=new Date(date.getFullYear(),date.getMonth()+1,0).getDate();
       if(month!=2)
       {
          if(no_days==30)
          {
            if(diff==29)
              result="Yesterday";
           else if(diff<29&&diff>23)
              result=days[date.getDay()];   
           else
            result=this.formatDate(date);
          }//no_days=30
        else  if(no_days==31)
        {
          if(diff==30)
            result="Yesterday";
         else if(diff<30&&diff>24)
            result=days[date.getDay()];   
         else
          result=this.formatDate(date);
        }//no_days=31
       }//not Feb
       else{
          let rem=date.getFullYear()%4;
          if(rem==0)
          {
            if(diff==28)
              result="Yesterday";
           else if(diff<28&&diff>22)
              result=days[date.getDay()];   
           else
            result=this.formatDate(date);
          }//leap year
         else if(rem!=0)
          {
            if(diff==27)
              result="Yesterday";
           else if(diff<27&&diff>21)
              result=days[date.getDay()];   
           else
            result=this.formatDate(date);
          }//not a leap year
        }//feb
      
      
       
     }
     else
     {
      result=this.formatDate(date);
     }
   }
   else
   {
    result=this.formatDate(date);
   }
  return result;
  }
  formatDate(dt)
  {
    var d=new Date(dt);
    let month:any=d.getMonth()+1;
    month=month>9?month:'0'+month;
    let day:any=d.getDate();
    day=day>9?day:'0'+day;
    return month+'.'+day+'.'+d.getFullYear();
  }

 
}
