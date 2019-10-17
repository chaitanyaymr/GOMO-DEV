import { SignalRServiceProvider } from './../../providers/signal-r-service/signal-r-service';
import { Component, NgZone } from '@angular/core';
import { GomoEnvironment } from '../../common/gomoenvironmnet';
import { GomoServiceProvider } from '../../providers/gomo-service/gomo-service';
import { GomodbServiceProvider } from './../../providers/gomodb-service/gomodb-service';
import { NavController, ModalController } from 'ionic-angular';
/**
 * Generated class for the GomoHeaderComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'gomo-header',
  templateUrl: 'gomo-header.html'
})
export class GomoHeaderComponent {

 uname:string="";
 uimg:string="";
 urole:string="";
 Chat_count:any=0;
 loggedInUserId:any=0;
 canSendMessage: boolean;
 isBroadCast:boolean=false;
 isNewConv:boolean=false;
  constructor(private db:GomodbServiceProvider,
              public gomoenv:GomoEnvironment,
              private gomoserv:GomoServiceProvider,
              private signalr:SignalRServiceProvider,
              private ngZone:NgZone,private navctrl:NavController,
              private broadcastmodal:ModalController
    ) {
   
    this.uname="";
    this.urole="";
    this.uimg="";
    this.Chat_count=this.gomoenv.Chat_count;
    this.subscribeToEvents();
    this.setHeader();
    if(this.gomoenv.pageid=="broadcast")
    {
      this.isBroadCast=true;
      this.isNewConv=false;
      this.gomoenv.pageid=0;
    }
  else if(this.gomoenv.pageid=="newconv")
    {
      this.isBroadCast=false;
      this.isNewConv=true
      this.gomoenv.pageid=0;
    }
    else
    {
      this.isBroadCast=false;
      this.isNewConv=false;
      this.gomoenv.pageid=1;
    }
  

  }
 setHeader()
 {
    this.db.getAllUsers().then(data=>{
      this.loggedInUserId=data[0].UserId;
      this.uname=data[0].userFName+" "+data[0].userLName;
      this.uname=this.uname.length>10? this.uname.substring(0,10)+"..":this.uname;
      this.uimg="https://devapi.usegomo.com/Images/Membersusers/"+data[0].UserImage;
      this.urole=data[0].Rolename.length>10?data[0].Rolename.substring(0,10)+"..":data[0].Rolename ;
      //this.unreadMessageCount();
    });
}
  unreadMessageCount()
  {
    let strstring="";
    strstring +="<convoInfo>"
    strstring +="<loggedInUserId>"+this.loggedInUserId+"</loggedInUserId>"
    strstring +="<projectId>0</projectId>"
    strstring +="</convoInfo>"

             this.gomoserv.UnreadConvoCount(strstring).subscribe(res=>{
                 this.gomoenv.Chat_count=res[0].errId;
                this.Chat_count=this.gomoenv.Chat_count;
             });
  }
  openprofile()
 {
   this.navctrl.push('profilepage',{'loginid':this.loggedInUserId});
 }
 
  
 //Brodacast Page
 getBroadcast(){
  // let profileModal = this.broadcastmodal.create("broadcast", {uid:this.loggedInUserId});
  // profileModal.present();
  // this.isBroadCast=true;
  // profileModal.onDidDismiss(()=>{
  
  // })
  this.navctrl.push("broadcast", {uid:this.loggedInUserId})
}
  //New Conversation
  createNewConv()
  {
    this.navctrl.push("newconv",{uid:this.loggedInUserId});
  }
  gotoHome()
  {
    this.navctrl.setRoot("1",{LoginID:this.loggedInUserId});
  }

/******************************************************************************************************************** */
 /////////////////////////////////////////Signal-R//////////////////////////////////////////////////////////////////////
 private subscribeToEvents():void{
  this.signalr.connectionEstablished.subscribe(()=>{
    this.canSendMessage=true;
    console.log("Connection",this.canSendMessage);
  });
  this.signalr.messageReceived.subscribe(data=>{
      this.ngZone.run(()=>{
        console.log("signalr data",data.convinfo);
    // this.unreadMessageCount();
        
      })
  })
  this.db.getData.subscribe((userlist)=>{
    console.log("updated userlist",userlist);
    this.loggedInUserId=userlist.UserId;
      this.uname=userlist.userFName+" "+userlist.userLName;
      this.uname=this.uname.length>10? this.uname.substring(0,10)+"..":this.uname;
      this.uimg="https://devapi.usegomo.com/Images/Membersusers/"+userlist.UserImage;
      this.urole=userlist.Rolename.length>10?userlist.Rolename.substring(0,10)+"..":userlist.Rolename ;
      //this.unreadMessageCount();
  })

  this.gomoserv.getRead.subscribe((data)=>{
    console.log("From Read All",data);
    //this.unreadMessageCount();
  })
}

}
