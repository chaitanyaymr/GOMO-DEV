import { SignalRServiceProvider } from './../../providers/signal-r-service/signal-r-service';
import { GomoServiceProvider } from './../../providers/gomo-service/gomo-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { ActionSheetController } from 'ionic-angular';
import { GomoEnvironment } from '../../common/gomoenvironmnet';
/**
 * Generated class for the ForwardMessagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name:'ForwardMsg'
})
@Component({
  selector: 'page-forward-message',
  templateUrl: 'forward-message.html',
})
export class ForwardMessagePage {
  public convData : any;
  public searchTerm : any="";
  public selectedUsers :any = [];
  public loginuid : any;
  public modalflag : any;
  public saveGroup : any = 'N';
  public groupName : any = "";
  public actionbtn : any = 'N';
  imageURI:any;
  imageFileName:any;
  imageSrc:any;
  emplogo:any;
  empname:any;
  emprole:any;
  imageData :any;
  photoTaken: boolean = false;
  photoSelected: boolean;
  base64string:string="";
  mheader : any;
  mfooter : any;
  userConvData : any;
  uData: any=[];
  unames:any=[];
  isenabled:boolean=false;
  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     private gomoservice:GomoServiceProvider,
     private viewcon : ViewController,
     private loadingCtrl:LoadingController,
     private actionSheetController:ActionSheetController,
     private camera:Camera,
     private toastController:ToastController,
     private signalr:SignalRServiceProvider,
     private gomoenv:GomoEnvironment
     ) {
      this.isenabled=false;
      this.loginuid = this.navParams.get('uid');
      this.modalflag = this.navParams.get('flag');
     
     
       
        if(this.modalflag == 'G'){
           this.mheader = 'Create Group';
           this.mfooter = 'Next';
        }
        else if(this.modalflag == 'M'){
          this.mheader = 'Forward Message To';
          this.mfooter = 'Forward';
          this.userConvData = this.navParams.get('userData');
        }
        else if(this.modalflag == 'B'){
          this.uData = this.navParams.get('udata');
          this.mheader = 'Team Members';
          this.mfooter = 'Ok';
        }
        this.getConversation();
  }
//Loading Controller
presentLoading() {
  const loader = this.loadingCtrl.create({
    content: "Please wait...",
    duration: 3000
  });
  loader.present();
}


  getConversation()
  {
    let str="<getConvoInfo>";
    str+="<loggedInUserId>"+this.loginuid+"</loggedInUserId>";
    str+="<projectId>0</projectId>";
    str+="<tagFormType></tagFormType>";
    str+="<tagTitle></tagTitle><loadOnlyUNR>N</loadOnlyUNR><loadByFormBased>N</loadByFormBased></getConvoInfo>";
    this.gomoservice.GetConversationContactInfo(str).subscribe((res)=>{
      console.log(JSON.parse(res['_body']));
      this.convData = JSON.parse(res['_body']);
      if(this.modalflag == 'G' || this.modalflag == 'B'){
        var convdt = this.convData.filter(function(i){
          var gtype = i.groupType.trim();
            return (gtype != 'G' && gtype != 'B')
        });

        this.convData = convdt;     
        console.log("Selected Users :"+this.uData); 
      
     }else if(this.modalflag == 'M'){
        var convdt = this.convData.filter(function(i){
        var gtype = i.groupType.trim();
          return (gtype != 'B')
        });
      
        this.convData = convdt;     
        console.log("Selected Users :"+this.uData); 
     }

    if(this.uData.length > 0){
      for(var i=0;i<this.convData.length;i++){
        for(var x=0;x<this.uData.length;x++){
          if(this.convData[i].userId == this.uData[x]){
            this.convData[i].checked = true;
            this.selectedUsers.push(this.convData[i]);
          }
        }
      }
    }

 this.convData.sort(function(a, b){
  var nameA=a.converationName.toLowerCase().replace(/ /g,'');
  var nameB=b.converationName.toLowerCase().replace(/ /g,'');  
        
  if (nameA < nameB) //sort string ascending
   return -1;
  if (nameA > nameB)
   return 1;
  return 0; //default return value (no sorting)
 });


  console.log(this.convData);
 })
}



  selectMember(data){
    console.log(data);
    if (data.checked == true) {
       this.selectedUsers.push(data);
     } else {
      let newArray = this.selectedUsers.filter(function(el) {
        return el.userId !== data.userId;
     });
      this.selectedUsers = newArray;
      
      var widthdyc = (this.selectedUsers.length*66)+"px";

      document.documentElement.style.setProperty(`--width`, widthdyc);
    }
    console.log(this.selectedUsers);
   }
  
   //close modal
   closeModal(flag,urs){
    this.viewcon.dismiss({'flag':flag,'users':urs});
    }
  
    
    //Selected User List to save
    saveGroupList(users){
      this.isenabled=true;
        console.log(users);
        
        console.log(this.groupName);     

        

        
        var resp =  this.selectedUsers;

        var widthdyc = (resp.length*66)+"px";

        document.documentElement.style.setProperty(`--width`, widthdyc);
       
        if(this.modalflag == 'M'){
  
          console.log(resp);
           
            for(let x=0;x<resp.length;x++){
              this.userConvData;
              this.userConvData.ToUserid        = resp[x].userId;
              this.userConvData.GroupId         = resp[x].groupId;
              this.userConvData.ProjectId       = resp[x].projectId;
              this.userConvData.ConversationId  = resp[x].conversationId;
  
          this.gomoservice.ForwardMessage(this.userConvData.ConversationId,this.loginuid,this.userConvData.GroupId,this.userConvData.Message,this.userConvData.Msgid,this.userConvData.ProjectId,this.userConvData.ToUserid)
                          .subscribe(data=>{
                            console.log("Done Forwarding ",data);
                            console.log(this.userConvData);
                             this.callSignalr_sendMessage(this.userConvData.ConversationId,this.userConvData.ConversationId,this.userConvData.ToUserid);
                          })
             
                          
              }//endfor
           this.closeModal('Y',this.selectedUsers);
            // this.navCtrl.setRoot("1",{LoginID:this.loginuid});
           
        }else if(this.modalflag == 'G'){
          this.isenabled=false;
          this.saveGroup = "Y";
          console.log("its a group block...!");
        }else if(this.modalflag == 'B'){
          console.log("its a Broadcast block...!");
          this.viewcon.dismiss({'flag':'','users':users});
        }
       
        
    }
    saveList(users)
    {
      this.isenabled=true;
      let uids:any=[];
      users.forEach(element => {
          uids.push(element.userId);
      });
         
          this.createMessengerGroup(uids.join(',')+','+this.loginuid,this.groupName,this.actionbtn);
    }
    //Group Back button
    groupbackbtn(){
      console.log("back working..!");
      this.isenabled=false;
      this.saveGroup = "N";
    }
  
  
    //Remove user form selected create group list
    removeuser(usr){     
        var user = usr;
        user.checked = false;
        this.selectMember(user);
    }
  
    //Change Group type button private/public
    changegrouptype(typ){
      if(typ == 'private'){
        this.actionbtn = 'N';
      }else if(typ == 'public'){
        this.actionbtn = 'Y';
      }
        
    }
  
   
    takepicture() {
      this.camera.getPicture({
        quality: 75,
        destinationType: this.camera.DestinationType.DATA_URL,
        sourceType: this.camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: this.camera.EncodingType.JPEG,
        targetWidth: 800,
        targetHeight: 800,
        saveToPhotoAlbum: false
      }).then(imageData => {
        this.base64string = 'data:image/jpeg;base64,' + imageData;
        this.emplogo=this.base64string;
        this.imageData= imageData;
        this.photoTaken = true;
        this.photoSelected = false;
  
        console.log(this.emplogo);
      }, error => {
        console.log("ERROR -> " + JSON.stringify(error));
      });
    }
    
    selectFromGallery() {
      this.camera.getPicture({
        quality: 75,
        destinationType: this.camera.DestinationType.DATA_URL,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: true,
        encodingType: this.camera.EncodingType.JPEG,
        targetWidth: 800,
        targetHeight: 800,
        saveToPhotoAlbum: false,
        correctOrientation:true,
        
      }).then(imageData => {
        this.base64string = 'data:image/jpeg;base64,' + imageData;
        this.emplogo=this.base64string;
        this.imageData = imageData;
        this.photoTaken = false;
        this.photoSelected = true;
  
        console.log(this.emplogo);
      }, error => {
        console.log("ERROR -> " + JSON.stringify(error));
      });
    }
    /********************************************************************************************************************************************** */
    
    ShowCameraPopup()
    {
      const actionsheet=this.actionSheetController.create({
        buttons:[
          { 
            text: 'Take Photo', 
            handler: () => this.takepicture(),
            cssClass:'buttoncss',
            icon: 'camera'     
          },
          { 
            text: 'Choose From Gallery', 
            handler: () => this.selectFromGallery(),
            cssClass:'buttoncss',
            icon:'images' 
          },
          { text: 'Cancel', role: 'cancel',cssClass:'buttoncss' }
        ],
        cssClass:"action-sheets-groups-page"
    
      });
      actionsheet.present();
    }
  
createMessengerGroup(userids:any,title:any,ispublic:any)
{
   if(title.trim()=="")
   {
      alert("Enter Group Name");
   }
   else{
    let strString="";
    strString +="<CreateGroup>"
    strString +="<groupId>0</groupId>"
    strString +="<loggedInUserId>"+this.loginuid+"</loggedInUserId>"  
    strString +="<userIds>"+userids+"</userIds>"
    strString +="<groupName>"+title+"</groupName>"
    strString +="<projectId>0</projectId>"
    strString +="<isPublic>"+ispublic+"</isPublic>"
    strString +="<tagFormType></tagFormType>"
    strString +="<tagTitle></tagTitle>"
    strString +="</CreateGroup>"
          this.gomoservice.CreateMessengerGroup(strString).subscribe(
            res=>{
              console.log(res);
   
              let msg="";
              if(res[0].errId==0)
              {
               msg="Group created successfully!"
               let toUserid=0;
               toUserid=0;
               let str="<convoInfo>";
                str+="<groupId>"+res[0].convId+"</groupId>";
                str+="	<convoId>"+res[0].groupId+"</convoId>";
                str+="<loggedInUserId>"+this.loginuid+"</loggedInUserId>";
                str+="<userId>"+toUserid+"</userId>";
                str+="<connectionId>"+this.gomoenv.signalrConnectionId+"</connectionId>"
                str+="</convoInfo>";
               this.signalr.sendMessage_signalR(str).subscribe(data=>{
                           console.log("SignalRR",data);
               this.GetTokenAndGenerateNotification(res[0].groupId,res[0].convId,title);
                     this.navCtrl.setRoot("1",{LoginID:this.loginuid})
                        })
              }
                    
                else
                  msg="Somthing wewnt wrong!"
                  
              this.toastController.create({
                message:msg,
                duration: 3000
              }).present();
                
   
              
            }
          )
   }

}

callSignalr_sendMessage(grpid,convid,touid)
 {
   let str="<convoInfo>";
  str+="<groupId>"+grpid+"</groupId>";
  str+="	<convoId>"+convid+"</convoId>";
  str+="<loggedInUserId>"+this.loginuid+"</loggedInUserId>";
  str+="<userId>"+touid+"</userId>";
  str+="<connectionId>"+this.gomoenv.signalrConnectionId+"</connectionId>"
  str+="</convoInfo>";
this.signalr.sendMessage_signalR(str).subscribe(data=>{
console.log("SignalRR",data);
    })
 }


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/************************************************************************************************************************************************** */
//////////////////////////////////////FCM Notification///////////////////////////////////////////////////////////////////////////////////////////////

GetTokenAndGenerateNotification(grpid,convid,title)
{
  let str="<deviceTokenInfo>";
  str+="<userId>"+this.loginuid+"</userId>";
  str+="<groupId>"+grpid+"</groupId>";
  str+="</deviceTokenInfo>";
  let deviceTokens:any=[];
  let from_name:any="";
  this.gomoservice.GetFcmToken(str).subscribe(result=>{
    if(result.length>0)
    {
      for(let i=0;i<result.length;i++)
      deviceTokens.push(result[i].deviceToken);
      from_name=result[0].msgFormUserName;
        
      let notification:any={};
      let data:any={};
      let send_Obj:any={};
     notification={
      "title":"New "+title+" group created by "+from_name,
      "body":"",
      "sound":"default",
      "click_action":"FCM_PLUGIN_ACTIVITY",
      "icon":"fcm_push_icon"
      
     }
     let info:any={}
     info={
      convoDesg: "",
      convoId: convid,
      convoImage:"",
      convoName:title, 
      groupCType: "R",
      groupId:grpid,
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
      msgFromId:this.loginuid,
      seq: 1,
      status: "Y",
      tagInfo: [],
      typingStatus: false,
      unReadCount: 0,
      loginid:this.loginuid
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


noSpace(event)
{
   if(event.value == " ")
   {
     alert("No spaces are allowed");
     event.value=event.value.replace(/^\s+/,"");
   }
  
}





}//end for app
