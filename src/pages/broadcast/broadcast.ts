import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController, ToastController, Keyboard, AlertController } from 'ionic-angular';
import { GomoServiceProvider } from '../../providers/gomo-service/gomo-service';

import { HomePage } from '../../pages/home/home';
import { SignalRServiceProvider } from '../../providers/signal-r-service/signal-r-service';
import { GomoEnvironment } from '../../common/gomoenvironmnet';
/**
 * Generated class for the BroadcastPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name:'broadcast'
})
@Component({
  selector: 'page-broadcast',
  templateUrl: 'broadcast.html',
})
export class BroadcastPage {
  bcmessage:any='';
  msgdate:any = true;
  recpall:any = true;
  radnone:any = true;
  radread:any = false;
  radacknowlg:any = false;
  recpuser:any = false;  
  loginUid:any=0;
  selectedUsers:any = [];
  respType: string;
  broadusers: any;
  uids : any = [];
  emoji: boolean = false;
  scroolwidth:any;
  message:any;
  canSendMessage: boolean;
  
  constructor(private alertCtrl: AlertController,private signalr:SignalRServiceProvider,public ngZone:NgZone,public keyboard: Keyboard,private toastController:ToastController,public navCtrl: NavController, public navParams: NavParams,private modalController:ModalController,private viewcon:ViewController,private gomoservice:GomoServiceProvider,private gomoenv:GomoEnvironment) {
    this.gomoenv.pageid="broadcast";
    this.loginUid=this.navParams.get("uid");

    //Checking Keyboard opend or close
    
    var innerHeight=window.innerHeight;
    window.onresize=(e)=>{
      this.ngZone.run(()=>{
        if(window.innerHeight<innerHeight)
        {
          console.log("keyboard opened");
          this.emoji=false;
        }
        else
        {
          console.log("keyboard closed");
          
        }
      })
    }
    this.canSendMessage=signalr.connectionExists;
   // this.subscribeToEvents();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BroadcastPage');
   
  }
 //Selection Recipients
 getRespType(type){   
  if(type == 'recpuser'){
    this.recpall = false;
    this.recpuser = true;
    this.respType = "SU";
  }else if(type == 'recpall'){      
    this.recpuser = false;
    this.recpall = true;
    this.respType = "ALL";
    this.selectedUsers = [];
    this.uids = [];
    this.broadusers = 0;
  }
}

  //Required action date
  getRad(act){
    if(act == 'radnone')
      {
        this.radnone = true;
        this.radread = false;
        this.radacknowlg = false;
      }else if(act == 'radread')
      {
        this.radnone = false;
        this.radread = true;
        this.radacknowlg = false;
      }else if(act == 'radacknowlg')
      {
        this.radnone = false;
        this.radread = false;
        this.radacknowlg = true;
      }
  }

  //To Get Common Modal
  getCommonModal(){   
    let udt = Object(this.selectedUsers);
    console.log("Check selected Users :" + udt);
    if(udt.length > 0){
      var userids = [];
      let newArray = this.selectedUsers.filter(function(el) {       
          return userids.push(el.userId); 
      });
      this.selectedUsers = newArray;
      this.uids = userids;     
    }

    let profileModal = this.modalController.create("ForwardMsg", { 'uid':this.loginUid,'flag':'B', 'udata' : this.uids});
    profileModal.onDidDismiss(res => {
      console.log("Dismiss Modal:"+ res);   
      if((typeof res != "undefined") && res.users)
      {
        this.selectedUsers = res.users;    
          
        var widthdyc = (this.selectedUsers.length*200)+"px";

        document.documentElement.style.setProperty(`--width`, widthdyc);
      }
    });
    profileModal.present();
  }



  //Close modal
  cancelModal(){
    this.viewcon.dismiss();
   // this.navCtrl.setRoot("1",{LoginID:this.loginUid});
   //this.navCtrl.getActiveNav().setRoot("1",{LoginID:this.loginUid});
  }

 //Remove user form selected create group list
  removeuser(usr){     
    var user = usr;
    user.checked = false;
    this.selectMember(user);
  }

  //Selected Users
  selectMember(data){
    var userids = [];
    if (data.checked == true) {
      this.selectedUsers.push(data);      
    } else {
      let newArray = this.selectedUsers.filter(function(el) {
        if(el.userId !== data.userId){
          userids.push(el.userId);          
        }
        return el.userId !== data.userId;
    });
      this.selectedUsers = newArray;
      this.uids = userids;

      var widthdyc = (this.selectedUsers.length*200)+"px";

      document.documentElement.style.setProperty(`--width`, widthdyc);
      //this.scrollwidth();
    }
    console.log(this.selectedUsers);
    console.log("Selected UserIds :" + this.uids);
  }

  //Sending Broadcast Msg
  sendBroadcast(){   
  
    var users = [];
    var ract="N";
    ract=(this.radnone==true)?"N":"Y"
    if(this.recpuser == true && this.selectedUsers.length > 0){
      for(var x in this.selectedUsers){
        if(this.selectedUsers[x].userId > 0)
          users.push(this.selectedUsers[x].userId);
      }
      this.broadusers = users.join();
    }else if(this.recpuser == true && (this.selectedUsers.length == 0 || this.selectedUsers.length == undefined)){
        this.presentAlert();
        return false;
    }
    
    var postbody = {
                    BroadCastInfo:"<broadcastInfo><loggedInUserId>"+this.loginUid+"</loggedInUserId><recpType>"+this.respType+"</recpType><selectedRecp>"+this.broadusers+"</selectedRecp><messageDate>T</messageDate>"
                                  +"<rAction>"+ract+"</rAction><convoId>0</convoId></broadcastInfo>",
                    MsgText : this.bcmessage
                  }

      console.log(postbody);
      this.gomoservice.CreateBroadCast(postbody).subscribe(res=>{
          console.log("Response Broadcast : "+ res);
          //this.cancelModal();
          let msg="";
           if(res[0])
           {
            msg="Broadcast created successfully..!"
            let str="<convoInfo>";
            str+="<groupId>"+res[0].errMsg+"</groupId>";
            str+="	<convoId>"+res[0].errMsg+"</convoId>";
            str+="<loggedInUserId>"+this.loginUid+"</loggedInUserId>";
            str+="<userId>"+0+"</userId>";
            str+="<connectionId>"+this.gomoenv.signalrConnectionId+"</connectionId>"
            str+="</convoInfo>";
           this.signalr.sendMessage_signalR(str).subscribe(data=>{
                       console.log("SignalRR",data);
                      //  this.navCtrl.setRoot("1",{LoginID:this.loginUid})
                      this.GetTokenAndGenerateNotification(this.bcmessage,res[0].errMsg);
                    })
           }
                
             else
               msg="Somthing wewnt wrong!"
               
           this.toastController.create({
             message:msg,
             duration: 3000
           }).present();

          
      });
  }

  //Alert Controller
  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Alert',
      subTitle: 'Please select atleast one user..!',
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    alert.present();
  }


  //TextArea action
  keyboardCheck() {
    
    console.log('The keyboard is open:', this.keyboard.isOpen());
  }


  //Emoji
  emojiChange()
  {
    console.log("Emoji : "+ this.emoji);
   this.emoji = this.emoji === true ? false : true;
  }

  addEmoji(e) {
 
    console.log(e);
    this.bcmessage += e.emoji.native;
    console.log("Message ",this.bcmessage);
  }

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/************************************************************************************************************************************************** */
//////////////////////////////////////FCM Notification///////////////////////////////////////////////////////////////////////////////////////////////

GetTokenAndGenerateNotification(msgbody,convid)
{
  let str="<deviceTokenInfo>";
  str+="<userId>"+this.loginUid+"</userId>";
  str+="<groupId>"+convid+"</groupId>";
  str+="</deviceTokenInfo>";
  let deviceTokens:any=[];
  let from_name:any="";
  this.gomoservice.GetFcmToken(str).subscribe(result=>{
    if(result.length>0)
    {
      for(let i=0;i<result.length;i++)
      deviceTokens.push(result[i].deviceToken);
      from_name=result[0].msgFormUserName;
      console.log(deviceTokens);
      let notification:any={};
      let data:any={};
      let send_Obj:any={};
     notification={
      "title":"Message From "+from_name,
      "body":msgbody,
      "sound":"default",
      "click_action":"FCM_PLUGIN_ACTIVITY",
      "icon":"fcm_push_icon"
      
     }
    
        
          let info:any={}
     info={
      convoDesg: "",
      convoId: convid,
      convoImage: "",
      convoName:"To "+this.selectedUsers.length+" Users",
      groupCType: "R",
      groupId:convid,
      groupType:"B",
      isFav: true,
      isMute: false,
      isPublic: false,
      lastFType: "",
      lastFileName: "",
      lastMsg: "",
      lastMsgStatus: "",
      lastMsgTime: "",
      logStatus:'Offline',
      msgFromId:0,
      seq: 1,
      status: "Y",
      tagInfo: [],
      typingStatus: false,
      unReadCount: 0,
      loginid:this.loginUid
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
    this.message="";
  })
        
        this.navCtrl.setRoot("1",{LoginID:this.loginUid})
    
    }//end for if
    
  })
}





}//end for page
