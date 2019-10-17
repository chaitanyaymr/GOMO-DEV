import { GomoServiceProvider } from './../../providers/gomo-service/gomo-service';
import { Component, Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController, ToastController } from 'ionic-angular';
import { Dialogs } from '@ionic-native/dialogs';
import { GomoEnvironment } from '../../common/gomoenvironmnet';
import { SignalRServiceProvider } from '../../providers/signal-r-service/signal-r-service';
/**
 * Generated class for the TagmodalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name:'TagsModalPage'
})
@Component({
  selector: 'page-tagmodal',
  templateUrl: 'tagmodal.html',
})
export class TagmodalPage {
  convid:any="";
  loggedinUserid:any="";
  public intag : any;
  public tagsData = ['FACEBOOK','HVAC','CARRIER','ENGINEERING','AC SYSTEMS', 'ELECTRICAL'];
  public tagsInfo : any;
  public convData:any;
  public convoInfo:any;
  public convType : any;
  public isChecked = "false";
  public chkstatus = 'N';
  public  uid : any;
  sucess:boolean=false;

  public buttonColor: string = 'skyblue';
  
  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      private gomoservice:GomoServiceProvider,
      private alertCtrl: AlertController,
      private viewcon: ViewController,
      private dialogs: Dialogs,
      public renderer: Renderer,
      public toastController:ToastController,
      private gomoenv:GomoEnvironment,
      private signalr:SignalRServiceProvider
      ) {
    this.convid=this.navParams.get("convid");
    this.loggedinUserid=this.navParams.get("loggedinUserId");
    this.convType = this.navParams.get("convtype");
    console.log("Conv::"+this.convid+" User:"+this.loggedinUserid);
    this.renderer.setElementClass(viewcon.pageRef().nativeElement, 'my-popup', true);
     this.gomoenv.pageid=4;
  }



  ionViewDidLoad() {
    this.loadtagsinfo();
  }

  loadtagsinfo()
  {
    let data="";
    data="<getConvoInfo>";
    data+="<loggedInUserId>"+this.loggedinUserid+"</loggedInUserId>";
    data+="<projectId>0</projectId>";
    data+="<convoId>"+this.convid+"</convoId>";
    data+="</getConvoInfo>";
   console.log("Sending data"+data);
   this.gomoservice.getConvTags(data).subscribe((res)=>{
    console.log(JSON.parse(res['_body']));
    let resp = JSON.parse(res['_body']);
    this.convData = resp[0].convoTagInfo;
          this.convoInfo = resp[0].convoInfo;
          console.log(this.convData);
   },(err)=>console.log(err));
  }
//Input tag value
getTag(tg){
  // this.tagsData.push(tg.toUpperCase());
   this.intag="";

   this.dialogs.alert('Hello world').then(() => console.log('Dialog dismissed')).catch(e => console.log('Error displaying dialog', e));
   console.log(this.tagsData);
}

//Remove Tag
removeTag(tid){
 console.log(tid);
 this.tagsData.splice(tid,1);
 console.log(this.tagsData);
}

//Close Modal
closeModal(){
  this.gomoenv.pageid=2;
 this.viewcon.dismiss({'tagsCount':this.sucess});
}
showTag(tg){
  if(tg != ''){
    this.buttonColor = '#1481a3';        
  }else{
    this.buttonColor = 'skyblue';        
  }
}
//New Tag Dialog box
presentPrompt(tg) {       
  this.chkstatus = 'N';
  this.isChecked = '';
  var tagExists = [];

  tagExists = this.convData.filter(ids => {
    return ids.tagTile == tg;
  });

  if(tagExists.length > 0){
    
      this.toastController.create({
        message: "Tag Already Exists...!",
        duration: 3000
      }).present();

      return false;
  }else if(tagExists.length == 0){
 
    if(tg == '' || tg == undefined){
        return false;
    }else{        
      if(this.convType == 'G'){
        let dt = "<addNewTag><groupId>"+this.convoInfo[0].groupId+"</groupId><loggedInUserId>"+this.loggedinUserid+"</loggedInUserId><projectId>"+this.convoInfo[0].projectId+"</projectId><tagFormType>REG</tagFormType><tagTitle>"+tg+"</tagTitle></addNewTag>"
        this.addtagtoconv(dt)
      }else{

      
      let alert = this.alertCtrl.create({
        title: 'Tag Name: '+tg,
        message : 'Do you want to create new conversation?',
        cssClass: 'alertCustomCss',
        inputs: [
          {
            type : 'checkbox',
            name : 'groupingall',
            label : 'Do you want to carry all tags?',   
            id : 'ischecked',
            checked : false,
            handler: data => {
              console.log(data);
              this.isChecked = data.checked;
            }
          }
        ],
        buttons: [
          {
            text: 'Yes',
            role: 'Yes',
            handler: data => {           
              console.log('Yes group all Tags');

              if(this.isChecked.toString() == "true"){
                this.chkstatus = 'Y';
              }else{
                this.chkstatus = 'N';
              }

              if(this.convoInfo[0].groupType.trim() == 'G'){
                  this.uid = 0;
              }else{
                  this.uid = this.convoInfo[0].userId+','+this.loggedinUserid;
              }

              let dt = "<CreateConvoByTag><groupId>0</groupId><loggedInUserId>"+this.loggedinUserid+"</loggedInUserId><userIds>"+this.uid+"</userIds><projectId>"+this.convoInfo[0].projectId+"</projectId><tagFormType>REG</tagFormType><tagTitle>"+tg+"</tagTitle><carryGroupId>"+this.convoInfo[0].groupId+"</carryGroupId><isCarry>"+this.chkstatus+"</isCarry></CreateConvoByTag>"
              
              console.log(dt);
              this.postTags(dt);
            }
          },
          {
            text: 'No',
            handler: data => {
              let dt = "<addNewTag><groupId>"+this.convoInfo[0].groupId+"</groupId><loggedInUserId>"+this.loggedinUserid+"</loggedInUserId><projectId>"+this.convoInfo[0].projectId+"</projectId><tagFormType>REG</tagFormType><tagTitle>"+tg+"</tagTitle></addNewTag>"
              this.addtagtoconv(dt)
            }
          }
        ]
      });
      alert.present();
      }
    }
  }
}

//Remove Tag
removeTags(dt){
  console.log(dt);
  this.gomoservice.removeTags(dt).subscribe(res=>{
    console.log(res);
    if(res.status == 200){
      //this.gomoenv.ismsgsend=true;
      this.callSignalr_sendMessage();
      this.toastController.create({
        message:"Tag Removed Successfully..!",
      duration: 3000
      }).present();
      this.sucess=true;
      this.loadtagsinfo();
    }else{
      this.toastController.create({
        message:"Some thing went wrong please try again..!",
       duration: 3000
      }).present();
      this.loadtagsinfo();
    }
   // this.closeModal();
    this.sucess=true;
   
  });
}



//Post Tags
postTags(data){

  this.gomoservice.createConversationTags(data).subscribe(res=>{
      this.gomoenv.ismsgsend=true;
      this.callSignalr_sendMessage();  
       this.toastController.create({
          message:"success",
         duration: 3000
        }).present();
          this.navCtrl.setRoot("1",{LoginID:this.loggedinUserid});
          this.sucess=true;
  })

}

//Add Tag
addtagtoconv(data){
  this.gomoservice.addtags(data).subscribe(res=>{
    this.gomoenv.ismsgsend=true;
    this.callSignalr_sendMessage();
    this.toastController.create({
      message:"Tag Added Successfully..!",
     duration: 3000
    }).present();
   // this.closeModal();
    this.sucess=true;
    this.intag = "";
    this.loadtagsinfo();
  });

}


callSignalr_sendMessage()
 {
   let str="<convoInfo>";
  str+="<groupId>"+this.convoInfo[0].groupId+"</groupId>";
  str+="	<convoId>"+this.convoInfo[0].groupId+"</convoId>";
  str+="<loggedInUserId>"+this.loggedinUserid+"</loggedInUserId>";
  str+="<userId>"+this.convoInfo[0].userId+"</userId>";
  str+="<connectionId>"+this.gomoenv.signalrConnectionId+"</connectionId>"
  str+="</convoInfo>";
this.signalr.sendMessage_signalR(str).subscribe(data=>{
console.log("SignalRR",data);
    })
 }
}
