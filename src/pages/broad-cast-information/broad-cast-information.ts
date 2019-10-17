import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { GomoServiceProvider } from '../../providers/gomo-service/gomo-service';



@IonicPage({
  name:"BroadcastReadInfo"
})
@Component({
  selector: 'page-broad-cast-information',
  templateUrl: 'broad-cast-information.html',
})
export class BroadCastInformationPage {
    loggedinUserid:any=0;
    convid:any=-0;
    msgid:any=0;
    broadcastList:any=[];
  constructor(public navCtrl: NavController, public navParams: NavParams,private gomoservice:GomoServiceProvider,private viewctrl:ViewController) {
    this.loggedinUserid=this.navParams.get("uid");
    this.convid=this.navParams.get("convid");
    this.msgid=this.navParams.get("msgid");
      this.getData();
  }

  getData()
  {
    let str="";
    str+="<brdcastInfo>";
    str+="<loggedInUserId>"+this.loggedinUserid+"</loggedInUserId>";
    str+="<brdcastId>"+this.convid+"</brdcastId>";
    str+="<msgId>"+this.msgid+"</msgId>";
    str+="</brdcastInfo>";
   this.gomoservice.BroadcastMessageInformation(str).subscribe(data=>{
     console.log("received broadcast info",data);
        if(data.length>0)
        {
          for(let i=0;i<data.length;i++)
          {
            this.broadcastList.push(data[i]);
          }
          this.broadcastList=this.broadcastList.sort(this.compareValues('bUserName','asc'));
        }
   })

  }

  compareValues(key, order='asc') {
    return function(a, b) {
      if(!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        return 0;
      }
  
      const varA = (typeof a[key] === 'string') ?
        a[key].toUpperCase() : a[key];
      const varB = (typeof b[key] === 'string') ?
        b[key].toUpperCase() : b[key];
  
      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return (
        (order == 'desc') ? (comparison * -1) : comparison
      );
    };
  }

  closeModal()
  {
    this.viewctrl.dismiss();
  }

}
