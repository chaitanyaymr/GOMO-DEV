import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { GomoServiceProvider } from '../../providers/gomo-service/gomo-service';
import { GomoEnvironment } from '../../common/gomoenvironmnet';
import { SignalRServiceProvider } from '../../providers/signal-r-service/signal-r-service';

/**
 * Generated class for the ParticipantsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name:'participants'
})
@Component({
  selector: 'page-participants',
  templateUrl: 'participants.html',
})
export class ParticipantsPage {
   navdata:any=[];
   users:any=[];
   searchTerm:any="";
   loggedinUserId:any="";
   convid:any="";
   grpname:any="";
  constructor(public navCtrl: NavController, public navParams: NavParams,private viewctrl:ViewController,private gomoservice:GomoServiceProvider,private gomoenv:GomoEnvironment,private signalr:SignalRServiceProvider) {
       this.navdata=this.navParams.get("users");
       this.users=this.navParams.get("users").sort(this.compareValues('userName'));
       this.loggedinUserId=this.navParams.get("loginid");
       this.convid=this.navParams.get("convid");
       this.grpname=this.navParams.get('groupname');
       console.log("Users",this.users);
       console.log("Loginid:",this.loggedinUserId,"::",this.convid,"::::",this.grpname);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ParticipantsPage');
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
      this.viewctrl.dismiss({'users':this.users});
  }
  selectMember(user,event)
  {
    console.log("Event",event)
    let flag="Y";
    let uid=0;
    let uname="";
    if(event.checked)
    {
     this.users.forEach(element => {
       if(element.userId==user.userId)
       {
        element.userAdded="Y";
        uid=element.userId;
        uname=element.userName;
       }
    });
       flag="Y";
    }
    else{
      this.users.forEach(element => {
        if(element.userId==user.userId)
       {
        element.userAdded="N";
        uid=element.userId;
        uname=element.userName;
       }
     });
     flag="N"
    }
    let str="<addParticipant>";
    str+="<groupId>0</groupId>";
    str+="<loggedInUserId>"+this.loggedinUserId+"</loggedInUserId>";
    str+="<userId>"+uid+"</userId>";
    str+="<convoId>"+this.convid+"</convoId>";
    str+="</addParticipant>";
    if(flag=="Y")
    {
        this.gomoservice.AddParticipant(str).subscribe(data=>{
          console.log("added",data);
          this.callSignalr_sendMessage();
          this.GetTokenAndGenerateNotification(uname,'Y');
        })   
    }
   else
   {
     this.gomoservice.RemoveParticipant(str).subscribe(data=>{
       console.log("removed",data);
       this.callSignalr_sendMessage();
       this.GetTokenAndGenerateNotification(uname,'N');
     })
   }
  
  
  }

   //////////////////////////////////////////////////////SIGNALR///////////////////////////////////////////////
  callSignalr_sendMessage()
  {
    let toUserid=0;
   let str="<convoInfo>";
   str+="<groupId>"+this.convid+"</groupId>";
   str+="	<convoId>"+this.convid+"</convoId>";
   str+="<loggedInUserId>"+this.loggedinUserId+"</loggedInUserId>";
   str+="<userId>"+toUserid+"</userId>";
   str+="<connectionId>"+this.gomoenv.signalrConnectionId+"</connectionId>"
   str+="</convoInfo>";
 this.signalr.sendMessage_signalR(str).subscribe(data=>{
 console.log("SignalRR",data);
     })
 
  }

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/************************************************************************************************************************************************** */
//////////////////////////////////////FCM Notification///////////////////////////////////////////////////////////////////////////////////////////////

GetTokenAndGenerateNotification(participantName,flag)
{
  let str="<deviceTokenInfo>";
  str+="<userId>"+this.loggedinUserId+"</userId>";
  str+="<groupId>"+this.convid+"</groupId>";
  str+="</deviceTokenInfo>";
  let deviceTokens:any=[];
  let from_name:any="";
  this.gomoservice.GetFcmToken(str).subscribe(result=>{
    if(result.length>0)
    {
      for(let i=0;i<result.length;i++)
      deviceTokens.push(result[i].deviceToken);
      from_name=result[0].msgFormUserName;
      if(flag=="Y")
        {
          from_name=from_name+" added "+ participantName+" to "+this.grpname;
        }
      else{
        from_name=from_name+" removed "+ participantName+" to "+this.grpname;
      }
      console.log(deviceTokens);
      let notification:any={};
      let data:any={};
      let send_Obj:any={};
     notification={
      "title":from_name,
      "body":"",
      "sound":"default",
      "click_action":"FCM_PLUGIN_ACTIVITY",
      "icon":"fcm_push_icon"
      
     }
     let info:any={}
     info={
      convoDesg: "",
      convoId: this.convid,
      convoImage:"",
      convoName: this.grpname,
      groupCType: "R",
      groupId:this.convid,
      groupType:"G",
      isFav: true,
      isMute: false,
      isPublic: false,
      lastFType: "",
      lastFileName: "",
      lastMsg: "",
      lastMsgStatus: "",
      lastMsgTime: "",
      logStatus:"",
      msgFromId:0,
      seq: 1,
      status: "Y",
      tagInfo: [],
      typingStatus: false,
      unReadCount: 0,
      loginid:this.loggedinUserId
     }
     data={
      info:info,
     page:"https://cp.usegomo.com/Messenger",
     type:"Mobile",
     woid:44
     }

  send_Obj={
    notification:notification,
    data:data,
    registration_ids:deviceTokens,
    priority:"high",
    restricted_package_name:"com.pllc.usegomo"
  }
  this.gomoservice.GenerateNotification_FCM(send_Obj).subscribe(data=>{
    console.log("done notification",data);
  
  })

    }//end for if
    
  })
}

}
