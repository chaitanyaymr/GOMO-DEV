import { SignalRServiceProvider } from './../../providers/signal-r-service/signal-r-service';
import { GomodbServiceProvider } from './../../providers/gomodb-service/gomodb-service';
import { GomoEnvironment } from './../../common/gomoenvironmnet';
import { GomoServiceProvider } from './../../providers/gomo-service/gomo-service';
import { Component, ViewChild, NgZone,  OnInit, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, InfiniteScroll,AlertController, ToastController } from 'ionic-angular';
import { Content } from "ionic-angular";
//import * as jQuery$ from "jquery";
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { Base64 } from '@ionic-native/base64';
import { timingSafeEqual } from 'crypto';


import { Transfer } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';
import { ThrowStmt } from '@angular/compiler';
import { Camera } from '@ionic-native/camera';


/**
 * Generated class for the ConversationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name:'2'
})
@Component({
  selector: 'page-conversations',
  templateUrl: 'conversations.html',
})
export class ConversationsPage {
   @ViewChild(Content) content :Content;
   @ViewChild('chat_input') messageInput: ElementRef;
   emoji: boolean = false;
    convuser:any={};
    starredConv:string='N';
    tags_count:number=0;
    att_count:number=0;
    showPopover:boolean=false;
    showPopover_footer:boolean=false;
    convresult:any={};
    convinfo:any=[];
    convpermissioninfo:any=[];
    tagsinfo:any=[];
    usersinfo:any=[];
    docsData:any=[];
    convType:any="B";
    loggedinUserId:any;
    apifileurl:any="";
    showPopover2:any=[];
    message:any="";
    groupiconsurl:string="https://devapi.usegomo.com/Images/GroupIcons/";
    usericonurl:string="https://devapi.usegomo.com/Images/Membersusers/";
    replymsg:any="";
    replyConv:any="";
    msgid:any="";
  canSendMessage: boolean;
  editFlag:any=0;
  filename:string="";
   fileextension:string="";
   highLightReply_array:any=[];
   hightLightReply_flag:boolean=false;
   typing:boolean=false;
   isMute:boolean=false;
   newconv_convid:any="";
  lazyLoader: any="";
   doesLeft:any="N";
   imageData :any;
   base64string:string="";
  constructor(
     public navCtrl: NavController,
     public navParams: NavParams, 
     private gomoservice:GomoServiceProvider,
     private modalctrl:ModalController,
     public ngZone:NgZone,
     public appconst:GomoEnvironment,
     public db:GomodbServiceProvider,
     private signalr:SignalRServiceProvider,
     private filechooser:FileChooser,
     private filepath:FilePath,
     private base64:Base64,
     private gomoenv:GomoEnvironment,
     private transfer: Transfer, 
     private file: File,
     public alertCtrl: AlertController,
     private camera:Camera,
     public toastController:ToastController
     )
     {


      this.gomoenv.pageid=2;
          this.message="";
      // this.db.getAllUsers().then(data=>{
      //     let userinfo=data;
      //    this.loggedinUserId=userinfo[0].UserId;    
      //    console.log("From ngonit",this.loggedinUserId)
      // })


       
       this.groupiconsurl="https://devapi.usegomo.com/Images/GroupIcons/";
       this.usericonurl="https://devapi.usegomo.com/Images/Membersusers/";
      
      

       let obj=this.navParams.get("convobj");
       console.log("received",obj);
       this.convuser={
            convid:obj.convoId,
            groupid:obj.groupId,
            name:obj.convoName,
            toid:obj.userId,
            status:obj.convoRole,
            img:obj.convoImage,
            projectid:obj.projectId,
            convtype:obj.convtype.trim(),
            loginid:obj.loginid,
            dataobj:obj.dataobj
          };
          this.loggedinUserId=this.convuser.loginid;
       //   console.log('contructor dataobj'+this.convuser.dataobj);
    this.starredConv='N';
    this.tags_count=0;
    this.att_count=0;
    this.showPopover=false;
    this.showPopover_footer=false;
    this.convType="";
    
    this.apifileurl="https://devapi.usegomo.com/Images/CommFiles/";
    this.replymsg="";
   
    console.log("data",this.convuser)
    var innerHeight=window.innerHeight;
    window.onresize=(e)=>{
      this.ngZone.run(()=>{
        if(window.innerHeight<innerHeight)
        {
          console.log("keyboard opened");
          this.emoji=false;
         if(this.gomoenv.pageid==2)
         {
          setTimeout(() => {
            this.content.scrollToBottom();
        }, 1000);
         }
        }
        else
        {
          console.log("keyboard closed");
          
        }
      })
    }
    this.canSendMessage=signalr.connectionExists;
    this.subscribeToEvents();
 
  }


clearData()
{
  this.msgid=0;
 // this.message="";
  this.convinfo=[];
  this.convpermissioninfo=[];
  this.tagsinfo=[];
  this.tags_count=0;
  this.usersinfo=[];
  this.convType="";
  this.docsData=[];
  this.att_count=0;
  this.editFlag=0;
}

  loadData()
  {
    this.clearData();
   // this.appconst.startLoading();
   this.gomoenv.globleconvid=this.convuser.convid;
   // let str="";
    //str+="<getConversation>";
    //str+="<convoId>"+this.convuser.convid+"</convoId>";
    //str+=" <loggedInUserId>"+this.loggedinUserId+"</loggedInUserId>";
    // str+="</getConversation>";
    //   this.gomoservice.GetConversationInfo(str).subscribe((data)=>{
    //     console.log("received data",data);
    let data=this.convuser.dataobj;
         if(data.length>0)
          {
            this.convresult=data;
           //this.convinfo=data[0].coversationInfo;
            data[0].coversationInfo.forEach(element=>{
             this.convinfo.push({
               $id:element.$id,
               msgBroadcast:element.msgBroadcast,
               msgDeleted:element.msgDeleted,
               msgEdited:element.msgEdited,
               msgFileName:element.msgFileName,
               msgFileType:element.msgFileType,
               msgId:element.msgId,
               msgMessage:element.msgMessage,
               msgNeedAttenstion:element.msgNeedAttenstion,
               msgNeedAttenstionBy:element.msgNeedAttenstionBy,
               msgReadStatus:element.msgReadStatus,
               msgRecieverId:element.msgRecieverId,
               msgSenderCCode:element.msgSenderCCode,
               msgSenderId:element.msgSenderId,
               msgSenderName:element.msgSenderName,
               msgType:element.msgType,
               msggroupType:element.msggroupType,
               selectedMsg:element.selectedMsg,
               selectedMsgFileName:element.selectedMsgFileName,
               selectedMsgFileType:element.selectedMsgFileType,
               selectedMsgId:element.selectedMsgId,
               selectedMsgSender:element.selectedMsgSender,
               slectedMsgSenderId:element.slectedMsgSenderId,
               ts:element.ts,
               dt:this.convertToDate(element.ts)
             })
            this.highLightReply_array.push(false);
           })
           this.convpermissioninfo=data[0].coversationPermissionInfo;
           this.tagsinfo=data[0].coversationTagsInfo;
           this.tags_count=this.tagsinfo.length;
           this.usersinfo=data[0].coversationUsersInfo;
           if(this.usersinfo.length>0)
           {
            this.isMute=(this.usersinfo[0].msgConvoIsMute.toUpperCase()=="N")?true:false;
            this.convType=this.usersinfo[0].msgConvoType;
            this.starredConv=this.usersinfo[0].msgIsFavorite.toUpperCase();
            this.doesLeft=(this.usersinfo[0].msgConvoStatus.toUpperCase().trim()=="Y" || this.usersinfo[0].msgConvoStatus.toUpperCase().trim()=="A")?"N":"Y";
            this.convuser.status=this.usersinfo[0].msgUserDesignation;
           }
           
           this.docsData=this.getDocsData();
           //this.att_count=this.docsData.length;
           
          
          //  if(this.convType.toUpperCase().trim()=="G")
          //  {
          //    this.convuser.status=this.usersinfo[0].msgUserDesignation.length>10?this.usersinfo[0].msgUserDesignation.substring(0,10)+"..":this.usersinfo[0].msgUserDesignation;
          //  }
             
          
           console.log("Conversations:",this.convinfo);
           console.log("Permissions",this.convpermissioninfo);
           console.log("TagsInfo",this.tagsinfo);
           console.log("UserInfo",this.usersinfo);
           console.log("DocsData",this.docsData);
           console.log("ConvType",this.convType);
              
           this.content.scrollToBottom();
           this.readconversation_info()
          this.readAllMessages();
          this.callsignalR_sendTyping("false","read");
         }
        //  else
        //  {
        //    alert("No Conversations Found");
        //  }
        
          // setTimeout(() => {
          //   this.content.scrollToBottom();
            
          // }, 1000);
        
          this.content.resize() 
     // })
     this.gomoenv.stopLoading();
     
  }

  ionViewDidLoad() {
    this.message="";

    console.log('didload dataobj'+this.convuser.dataobj);
    this.loadData();
  }
  

  readAllMessages()
  {
    let str="<msgInfo>";
    str+="<convoId>"+this.convuser.convid+"</convoId>";
    str+="<groupId>"+this.convuser.groupid+"</groupId>";
    str+="<loggedInUserId>"+this.loggedinUserId+"</loggedInUserId>"
    str+=" </msgInfo>";
    this.gomoservice.readAllMessageConvo(str).subscribe(data=>{
      console.log("read all messages done");
    })
  }

  

   changeddlUserOptions(value)
   {
   
     console.log("value changed to",value)
     this.showPopover=!this.showPopover
     if(value=="info")
     {
       this.openAboutPage('A');
     }
     else if(value=="mute")
     {
      this.muteConversation('N');
     }
     else if(value=="cancelmute")
     {
      this.muteConversation('Y');
      
     }
     else if(value=="clear")
     {
      this.gomoenv.isdeleteorclear="C";
       this.clearMessages();
       this.att_count=0;
       
     }
     else if(value=="delete")
     {
      this.gomoenv.isdeleteorclear="D";
      this.att_count=0;
        this.deleteConversation();
     }

     
   }

   muteConversation(flag)
   {
     let str="<convoInfo>";
     str+="<loggedInUserId>"+this.loggedinUserId+"</loggedInUserId>";
     str+="<convoId>"+this.convuser.convid+"</convoId>";
     str+="<isMuted>"+flag+"</isMuted>";
     str+="</convoInfo>";
     this.gomoservice.muteConversation(str).subscribe(data=>{
        this.isMute=(flag.toUpperCase()=="N")?true:false
     })

   }



  getDocsData()
  {
   
    // return this.convinfo.filter((item)=>{
    //   return((item.msgFileType.toLowerCase().indexOf("pdf")>-1) || (item.msgFileType.toLowerCase().indexOf("csv")>-1) || (item.msgFileType.toLowerCase().indexOf("doc")>-1) 
    //   || (item.msgFileType.toLowerCase().indexOf("docx")>-1) || (item.msgFileType.toLowerCase().indexOf("txt")>-1) || (item.msgFileType.toLowerCase().indexOf("gif")>-1)
    //   || (item.msgFileType.toLowerCase().indexOf("jpeg")>-1) || (item.msgFileType.toLowerCase().indexOf("jpg")>-1) || (item.msgFileType.toLowerCase().indexOf("xls")>-1)
    //   || (item.msgFileType.toLowerCase().indexOf("xlsx")>-1) || (item.msgFileType.toLowerCase().indexOf("ods")>-1) || (item.msgFileType.toLowerCase().indexOf("png")>-1)
    //   ) 
    // });
    let result:any=[];
    let str="<getTagInfo>";
    str+="<convoId>"+this.convuser.convid+"</convoId>";
    str+="<loggedInUserId>"+this.loggedinUserId+"</loggedInUserId>";
    str+="</getTagInfo>";
    this.gomoservice.CountConversation_TagsAndDocs(str).subscribe((data)=>{
      result=data;
      this.att_count=data[0].mediaCnt;
    })
    
  }
clearPopOver()
{
  for(let i=0;i<this.showPopover2.length;i++)
  {
    this.showPopover2[i]=false;
  }
}
  changeddlMsgOptions(conv,value,index)
  {
    console.log("Conv",conv);
    console.log("changed",value)
    this.clearPopOver();
    this.closeReplyMessage();
    this.msgid=0;
    this.editFlag=0;
    //ForWard Message
    if(value=="forward")
    {
      let convData = {        
        'FromUserid'      : this.loggedinUserId,
        'Message'         : conv.msgMessage,
        'Msgid'           : conv.msgId,
        'msgType'         : conv.msgType,
        'ToUserid'        : '',
        'GroupId'         : '',
        'ProjectId'       : '',
        'ConversationId'  : ''
      }
     let modal=this.modalctrl.create("ForwardMsg",{ 'uid':this.loggedinUserId,'flag':'M', 'userData' : convData});
     
     modal.present();
     modal.onDidDismiss(data=>{
      if(typeof data=="undefined" || data.flag=="N")
      {
                  
      }
      else
      {
        // this.loadData();
        this.navCtrl.setRoot("1",{LoginID:this.loggedinUserId});
      }
     })
    }
    //Reply Message
    else if(value=="reply")
       {
          this.replyMessage(conv,index);
      }
   //Edit Message
    else if(value=="edit")
      {
        this.editFlag=1;
         this.editMessage(conv);
      } 
    //Delete Message
    else if(value=="delete")
    {
       this.deleteMessage(conv);
    }
   //Unread
   else if(value=="unread")
   {
     this.unReadMessage(conv);
   }
      

  }

  openLi(index)
  {
    this.clearPopOver();
    this.showPopover2[index]=true;
  }
  
  convertToDate(ts)
  {
    let d=new Date(ts);
    return d.toDateString();
  }

  openTagsModal()
  {
      let modal=this.modalctrl.create('TagsModalPage', {'convid':this.convuser.convid,'loggedinUserId':this.loggedinUserId,'convtype':this.convuser.convtype});
      modal.present();
      modal.onDidDismiss((data)=>{
        if(typeof data=="undefined" || data.tagsCount=="")
           {
         
           }
           else
           {
              // var val=data.tagsCount;
              // if(val==true)
              //   this.tags_count++;
             //console.log("tags count",this.tags_count);
           }
           this.bindtagscount();  
      })
  }

   openAboutPage(flag)
   {
     let data:any={
      loginid:this.loggedinUserId,
      groupid:this.convuser.groupid,
      toid:this.convuser.toid,
      projectid:this.convuser.projectid,
      docsdata:this.docsData,
      convtype: this.convType,
      pagetype: flag
     }
    this.navCtrl.push('AboutPage',{'data':data,'parentPage':this,'flag':flag});
    
   }

   onFocus() {
    this.emoji = false;
    this.content.resize();
    this.scrollToBottom();
  }
 
   emojiChange()
   {   
    
    this.emoji = !this.emoji;

    // if (!this.emoji) {
    //   this.focus();
    // }    
    // else {
    //   this.setTextareaScroll();
    // }
    this.setTextareaScroll();
    this.content.resize();
    this.scrollToBottom();
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
    }, 1000)
  }

  private focus() {
    if (this.messageInput && this.messageInput.nativeElement) {
      this.messageInput.nativeElement.focus();
    }
  }

  private setTextareaScroll() {
    const textarea =this.messageInput.nativeElement;
    textarea.scrollTop = textarea.scrollHeight;
  }


async appendData()
   {
    let str="";
    let convid:any="";
    convid=(this.convuser.convid==0)?this.newconv_convid:this.convuser.convid;
    if(this.convuser.convid==0)
    {
      str+="<getConversation>";
      str+="<convoId>"+convid+"</convoId>";
      str+=" <loggedInUserId>"+this.loggedinUserId+"</loggedInUserId>";
      str+="</getConversation>";
        this.gomoservice.GetConversationInfo(str).subscribe((data)=>{
          console.log("Append data",data);
           if(data.length>0)
           {
            let lastconv=data[0].coversationInfo[data[0].coversationInfo.length-1];
            console.log("lastconv",lastconv);
            this.convinfo.push({
              $id:lastconv.$id,
              msgBroadcast:lastconv.msgBroadcast,
              msgDeleted:lastconv.msgDeleted,
              msgEdited:lastconv.msgEdited,
              msgFileName:lastconv.msgFileName,
              msgFileType:lastconv.msgFileType,
              msgId:lastconv.msgId,
              msgMessage:lastconv.msgMessage,
              msgNeedAttenstion:lastconv.msgNeedAttenstion,
              msgNeedAttenstionBy:lastconv.msgNeedAttenstionBy,
              msgReadStatus:lastconv.msgReadStatus,
              msgRecieverId:lastconv.msgRecieverId,
              msgSenderCCode:lastconv.msgSenderCCode,
              msgSenderId:lastconv.msgSenderId,
              msgSenderName:lastconv.msgSenderName,
              msgType:lastconv.msgType,
              msggroupType:lastconv.msggroupType,
              selectedMsg:lastconv.selectedMsg,
              selectedMsgFileName:lastconv.selectedMsgFileName,
              selectedMsgFileType:lastconv.selectedMsgFileType,
              selectedMsgId:lastconv.selectedMsgId,
              selectedMsgSender:lastconv.selectedMsgSender,
              slectedMsgSenderId:lastconv.slectedMsgSenderId,
              ts:lastconv.ts,
              dt:this.convertToDate(lastconv.ts)
            })
           // this.content.scrollToBottom();
           if(lastconv.msgFileType!="")
           {
             //this.getDocsData();
             this.att_count++;
           }
           this.highLightReply_array.push(false);
           this.readconversation_info();
            this.readAllMessages();
            if(lastconv.msgSenderId==this.loggedinUserId)
            {
              this.callsignalR_sendTyping("false","read");
            }
            //this.callsignalR_sendTyping("false","read");
           
            }
           });
         
    }//end for if
    else if(this.convuser.convid>0 && this.convinfo.length==0)
    {
        let str="";
          str+="<getConversation>";
          str+="<convoId>"+this.convuser.convid+"</convoId>";
          str+=" <loggedInUserId>"+this.loggedinUserId+"</loggedInUserId>";
          str+="</getConversation>";
          this.gomoservice.GetConversationInfo(str).subscribe((data)=>{
            if(data[0].coversationInfo.length>0)
            { 
              this.convinfo.push({
                $id:data[0].coversationInfo[0].$id,
                msgBroadcast:data[0].coversationInfo[0].msgBroadcast,
                msgDeleted:data[0].coversationInfo[0].msgDeleted,
                msgEdited:data[0].coversationInfo[0].msgEdited,
                msgFileName:data[0].coversationInfo[0].msgFileName,
                msgFileType:data[0].coversationInfo[0].msgFileType,
                msgId:data[0].coversationInfo[0].msgId,
                msgMessage:data[0].coversationInfo[0].msgMessage,
                msgNeedAttenstion:data[0].coversationInfo[0].msgNeedAttenstion,
                msgNeedAttenstionBy:data[0].coversationInfo[0].msgNeedAttenstionBy,
                msgReadStatus:data[0].coversationInfo[0].msgReadStatus,
                msgRecieverId:data[0].coversationInfo[0].msgRecieverId,
                msgSenderCCode:data[0].coversationInfo[0].msgSenderCCode,
                msgSenderId:data[0].coversationInfo[0].msgSenderId,
                msgSenderName:data[0].coversationInfo[0].msgSenderName,
                msgType:data[0].coversationInfo[0].msgType,
                msggroupType:data[0].coversationInfo[0].msggroupType,
                selectedMsg:data[0].coversationInfo[0].selectedMsg,
                selectedMsgFileName:data[0].coversationInfo[0].selectedMsgFileName,
                selectedMsgFileType:data[0].coversationInfo[0].selectedMsgFileType,
                selectedMsgId:data[0].coversationInfo[0].selectedMsgId,
                selectedMsgSender:data[0].coversationInfo[0].selectedMsgSender,
                slectedMsgSenderId:data[0].coversationInfo[0].slectedMsgSenderId,
                ts:data[0].coversationInfo[0].ts,
                dt:this.convertToDate(data[0].coversationInfo[0].ts)
              })
              if(data[0].coversationInfo[0].msgFileType!="")
                {
                  //this.getDocsData();
                  this.att_count++;
                 }
              //setTimeout(() => {
             //  this.content.scrollToBottom();
           // }, 1000);
           this.highLightReply_array.push(false);
           this.readconversation_info();
              this.readAllMessages();
              if(data[0].coversationInfo[0].msgSenderId==this.loggedinUserId)
              {
                this.callsignalR_sendTyping("false","read");
              }
             
            }

          });
    }//end for else if
    else{
      let len:any=0;
      len=(this.convinfo.length>0)?this.convinfo.length-1:0;
      str="<getConversation>";
    str+="<convoId>"+this.convuser.convid+"</convoId>";
    str+="<loggedInUserId>"+this.loggedinUserId+"</loggedInUserId>";
    str+="<lastMsgId>"+this.convinfo[len].msgId+"</lastMsgId>";
    str+="<getType>N</getType>";
    str+="</getConversation>";
    this.gomoservice.LoadMoreconversations(str).subscribe(data=>{
      console.log("loadmoredata::append",data);
      let convs=data[0].coversationInfo;
      if(convs.length>0)
      { 

       convs.forEach(element => {
        this.convinfo.push({
          $id:element.$id,
          msgBroadcast:element.msgBroadcast,
          msgDeleted:element.msgDeleted,
          msgEdited:element.msgEdited,
          msgFileName:element.msgFileName,
          msgFileType:element.msgFileType,
          msgId:element.msgId,
          msgMessage:element.msgMessage,
          msgNeedAttenstion:element.msgNeedAttenstion,
          msgNeedAttenstionBy:element.msgNeedAttenstionBy,
          msgReadStatus:element.msgReadStatus,
          msgRecieverId:element.msgRecieverId,
          msgSenderCCode:element.msgSenderCCode,
          msgSenderId:element.msgSenderId,
          msgSenderName:element.msgSenderName,
          msgType:element.msgType,
          msggroupType:element.msggroupType,
          selectedMsg:element.selectedMsg,
          selectedMsgFileName:element.selectedMsgFileName,
          selectedMsgFileType:element.selectedMsgFileType,
          selectedMsgId:element.selectedMsgId,
          selectedMsgSender:element.selectedMsgSender,
          slectedMsgSenderId:element.slectedMsgSenderId,
          ts:element.ts,
          dt:this.convertToDate(element.ts)
        }) 
        if(element.msgFileType!="")
        {
          // this.getDocsData();
          this.att_count++;
         }
        this.highLightReply_array.push(false);
       });
       
        setTimeout(() => {
       this.content.scrollToBottom();
       }, 1000);
       this.readconversation_info();
       this.readAllMessages();
        // if(data[0].coversationInfo[0].msgSenderId==this.loggedinUserId)
        // {
          this.callsignalR_sendTyping("false","read");
     //   }
        //this.callsignalR_sendTyping("false","read");
      //  setTimeout(() => {
      //     this.content.scrollToBottom();
      //   }, 2000);
      }
    });//end for service


    }//end for else
    
   }
SendMessage()
{
  console.log("message",this.message);
  if (this.emoji) {
    this.emoji = false;
  }
let toUserid=0;
toUserid=this.convType.toUpperCase()=="G"?0:this.convuser.toid;


  this.gomoservice.sendMessage(this.loggedinUserId,toUserid,this.message,this.convuser.groupid,this.convuser.convid,this.convuser.projectid,this.msgid).subscribe(async (res)=>{
    let msg="";
    msg=this.message;
    this.message="";
       console.log("Result",res);
       this.newconv_convid=res[0].convoOutId;
       this.callSignalr_sendMessage();
       this.msgid="";
       this.gomoenv.ismsgsend=true;
       this.GetTokenAndGenerateNotification(msg);
       this.closeReplyMessage();
      
      await this.appendData();
      
 })
}
addEmoji(e) {
  
  console.log(e);
  this.message += e.emoji.native;
  console.log("Message ",this.message);
}
backtoHome()
{
 // this.navCtrl.setRoot("1",{LoginID:this.loggedinUserId});
 
    this.navCtrl.pop();
}

  replyMessage(conv:any,i)
  {
    let msg=conv.msgMessage;
    this.replymsg="sometext";
    this.replyConv=conv;
    this.msgid=conv.msgId;
  }
  closeReplyMessage()
  {
    this.replyConv={};
    this.replymsg="";
    this.msgid=0;
  }

 highlightReply(conv:any,i)
 {
    this.hightLightReply_flag=!this.hightLightReply_flag;
     for(let y=0;y<this.highLightReply_array.length;y++)
       this.highLightReply_array[y]=false;
   
       let index=0;
       for(let r=0;r<this.convinfo.length;r++)
       {
          if(conv.selectedMsgId==this.convinfo[r].msgId)
             index=r;
       }
     if(this.hightLightReply_flag==true)
     {
      
      for(let t=0;t<this.highLightReply_array.length;t++)
      {
        if(t==index)
         this.highLightReply_array[t]=true;
       else
         this.highLightReply_array[t]=false;
      }
      let y:any=document.getElementById("div"+index).offsetTop;
      setTimeout(() => {
        this.content.scrollTo(0,y);
      }, 2000);
     }

      

  console.log("highligh arr",this.highLightReply_array);
  console.log("highligh flag",this.hightLightReply_flag);
  console.log("conv",conv,"i",i);
 }
 
  editMessage(conv)
  {
      this.message=conv.msgMessage;
      this.msgid=conv.msgId;
  }

  EditMessage_Send()
  {
     this.gomoservice.EditMessage(this.message,this.msgid).subscribe((data)=>{
       console.log("Edit result",data);
      //this.loadData();
      // this.callSignalr_sendMessage();
      
       this.convinfo.forEach(element => {
        if(element.msgId==this.msgid)
        {
          element.msgEdited="Y";
          element.msgMessage=this.message;
        }
         
     });
     this.message="";
     this.msgid=0;
     this.editFlag=0;
     })
  }
 unReadMessage(conv)
 {
   let str="<msgInfo>";
   str+="<msgId>"+conv.msgId+"</msgId>";
   str+="<convoId>"+this.convuser.convid+"</convoId>";
   str+="<groupId>"+this.convuser.groupid+"</groupId>";
   str+="<loggedInUserId>"+this.loggedinUserId+"</loggedInUserId>";
   str+="</msgInfo>";
   this.gomoservice.UnReadMessage(str).subscribe(data=>{
     console.log("unread done",data);
     this.callSignalr_sendMessage();
     this.navCtrl.setRoot("1",{LoginID:this.loggedinUserId});
   })
 }
 deleteMessage(conv)
 {
   let str="<msgInfo>";
   str+="<msgId>"+conv.msgId+"</msgId>";
   str+="<loggedInUserId>"+this.loggedinUserId+"</loggedInUserId>"
   str+="</msgInfo>";
   this.gomoservice.DeleteMessage(str).subscribe(data=>{
     console.log("deleted",data);
    // this.callSignalr_sendMessage('');
     //this.loadData();
     this.convinfo.forEach(element => {
        if(element.msgId==conv.msgId)
         element.msgDeleted="Y";
     });

   })
   if(conv.msgFileType!="")
   {
     this.getDocsData();
   }
 }


 


  clearMessages()
  {
    let str="<convoInfo>";
     str+="<convoId>"+this.convuser.convid+"</convoId>";
     str+="<loggedInEmpId>"+this.loggedinUserId+"</loggedInEmpId>";
     str+="</convoInfo>";
     this.gomoservice.clearConvo(str).subscribe(data=>{
       console.log("clear conv done",data);
       this.callSignalr_sendMessage();
       //this.loadData();
       this.convuser.dataobj=[];
       this.convinfo=[];
     })

  }

  deleteConversation()
  {
    // let str="<convoInfo>";
    //  str+="<convoId>"+this.convuser.convid+"</convoId>";
    //  str+="<loggedInEmpId>"+this.loggedinUserId+"</loggedInEmpId>";
    //  str+="</convoInfo>";
    //  this.gomoservice.DeleteConv(str).subscribe(data=>{
    //    console.log("Delete conv done",data);
    //    this.callSignalr_sendMessage();
    //  // this.loadData();
    //  this.convuser.dataobj=[];
    //    this.convinfo=[];
    //    this.navCtrl.setRoot("1",{LoginID:this.loggedinUserId});
    //  })
    
      let alert = this.alertCtrl.create({
        title: 'Confirm Delete',
        message: 'Do you want to Delete this conversation?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
                console.log('cancel clicked')
            }
          },
          {
            text: 'Yes',
            handler: () => {
               
              let strstring="";
                   strstring +='<convoInfo>'
                   strstring +='<convoId>'+this.convuser.convid+'</convoId>'
                   strstring +='<loggedInEmpId>'+this.loggedinUserId+'</loggedInEmpId>'
                   strstring +='</convoInfo>'
    
                  
                  this.gomoservice.DeleteConv(strstring).subscribe(data=>{
                    console.log(data);
                    let msg='';
                    if(data[0].errId==0)
                      msg='success'
                      else
                      msg='failed!'
                      this.callSignalr_sendMessage();
                      this.convuser.dataobj=[];
                      this.convinfo=[];
                     
                      this.navCtrl.setRoot("1",{LoginID:this.loggedinUserId});
                   
                  });
                }
              }
                 
               ]
      });
      
      alert.present();

  }
  makeFavAndUnfav(flag)
      {
        this.starredConv=flag;
        let str="<getConvoInfo>";
        str+="<loggedInUserId>"+this.loggedinUserId+"</loggedInUserId>";
        str+="<projectId>"+ this.convuser.projectid+"</projectId>";
        str+="<convoId>"+this.convuser.convid+"</convoId>";
        str+="<isFav>"+flag+"</isFav>"
        str+="</getConvoInfo>";
        this.gomoservice.MakeFavAndUnfav(str).subscribe(data=>{
          console.log("Fav",data,"Flag",flag);
          
        })

      }
      openFile()
      {
        this.filechooser.open()
                        .then(uri=>{
                          console.log("opened",uri);
                          this.filepath.resolveNativePath(uri)
                                       .then(file=>{
                                         console.log("filePath",file);
                                         let filePath:string=file;
                                         this.filename=filePath.substr(filePath.lastIndexOf('/')+1);
                                         this.fileextension=this.filename.split(".")[this.filename.split(".").length-1];
                                         console.log("filename",this.filename,"extension:",this.fileextension);
                                         if(filePath)
                                         {
                                           this.base64.encodeFile(filePath)
                                                      .then((base64string:any)=>{
                                                            let str:any=""
                                                            let msg:any="";
                                                            if(this.fileextension=="jpg"||
                                                               this.fileextension=="jpeg"||this.fileextension=="png"||
                                                               this.fileextension=="gif"
                                                               )
                                                               {
                                                                 str="data:image/"+this.fileextension+";base64";
                                                                 msg="Sent an image";
                                                               }
                                                            else
                                                            {
                                                              str="data:application/"+this.fileextension+";base64";
                                                              msg="Sent a file";

                                                            }
                                                            str=str+","+base64string.split(",")[1];
                                                            this.gomoenv.startLoading();
                                                         this.gomoservice.SaveFiles(this.filename,str).subscribe(res=>{
                                                           console.log("savedata",res);
                                                           let finalfilename:any=res[0].filename;
                                                           let toUserid=0;
                                                            toUserid=this.convType.toUpperCase()=="G"?0:this.convuser.toid;
                                                           this.gomoservice.UploadFiles(this.convuser.convid,finalfilename,this.fileextension,this.convuser.groupid,this.loggedinUserId,toUserid)
                                                                          .subscribe(async data=>{
                                                                            console.log("uploaddata",data);
                                                                            this.GetTokenAndGenerateNotification(msg);
                                                                           // this.loadData();
                                                                         await  this.appendData();
                                                                           this.getDocsData();
                                                                            this.callSignalr_sendMessage();
                                                                          })
                                                         })
                                                            
                                                             
                                                      })
                                                     .catch(err=>console.log("Error at base64",err))
                                         }
                                       })
                                       .catch(err=>console.log("error at filepath",err))
                        })
                        .catch(e=>console.log("Error",e))
      }
	  
      downloadFile(uri) {
         let url=this.apifileurl+uri;
         console.log("file url",uri);
        let extension=url.split(".")[url.split(".").length-1];
        let filename=url.substr(url.lastIndexOf('/')+1);
        const fileTransfer= this.transfer.create();
       // let fileURL =  "///storage/emulated/0/"+filename;
       this.gomoenv.startdownLoading();
        fileTransfer.download(url,this.file.externalDataDirectory+filename,true).then((entry)=>{
          this.gomoenv.stopLoading();    
                  this.toastController.create({
                     message:"Downloaded Successfully at " +this.file.externalDataDirectory,
                     duration: 5000
                   }).present(); console.log("download complete"+entry.toURL());
        },(error)=>console.log("error at download",error))

        }
 
bindtagscount(){
  let str="<getTagInfo>";
        str+="<loggedInUserId>"+this.loggedinUserId+"</loggedInUserId>";
        str+="<convoId>"+this.convuser.convid+"</convoId>";
        str+="</getTagInfo>";
      this.gomoservice.Convotagsinfo(str).subscribe(data=>{
           this.tags_count=data.length;
      })

}
ionViewWillLeave() {
  this.lazyLoader = null;
}

onScroll(event,infiniteScroll: InfiniteScroll)
{
  console.log("*****",event);
  try{
    this.lazyLoader = infiniteScroll;
  }
  catch(Error){
    console.log('timestamp');
    this.lazyLoader = null;
  }

  // if(event.scrollTop==0)
  // {
    //alert("top");
    let str="<getConversation>";
    str+="<convoId>"+this.convuser.convid+"</convoId>";
    str+="<loggedInUserId>"+this.loggedinUserId+"</loggedInUserId>";
    str+="<lastMsgId>"+this.convinfo[0].msgId+"</lastMsgId>";
    str+="<getType>O</getType>";
    str+="</getConversation>";

    this.gomoservice.LoadMoreconversations(str).subscribe(data=>{
      console.log("loadmoredata",data);
     
      let prevdata:any=this.convinfo;
     // this.convinfo=[];
      if(data[0].coversationInfo.length>0)
      { 
       // this.gomoenv.startLoading();
        // data[0].coversationInfo.forEach(element=>{
        //   this.convinfo.unshift({
        //     $id:element.$id,
        //     msgBroadcast:element.msgBroadcast,
        //     msgDeleted:element.msgDeleted,
        //     msgEdited:element.msgEdited,
        //     msgFileName:element.msgFileName,
        //     msgFileType:element.msgFileType,
        //     msgId:element.msgId,
        //     msgMessage:element.msgMessage,
        //     msgNeedAttenstion:element.msgNeedAttenstion,
        //     msgNeedAttenstionBy:element.msgNeedAttenstionBy,
        //     msgReadStatus:element.msgReadStatus,
        //     msgRecieverId:element.msgRecieverId,
        //     msgSenderCCode:element.msgSenderCCode,
        //     msgSenderId:element.msgSenderId,
        //     msgSenderName:element.msgSenderName,
        //     msgType:element.msgType,
        //     msggroupType:element.msggroupType,
        //     selectedMsg:element.selectedMsg,
        //     selectedMsgFileName:element.selectedMsgFileName,
        //     selectedMsgFileType:element.selectedMsgFileType,
        //     selectedMsgId:element.selectedMsgId,
        //     selectedMsgSender:element.selectedMsgSender,
        //     slectedMsgSenderId:element.slectedMsgSenderId,
        //     ts:element.ts,
        //     dt:this.convertToDate(element.ts)
        //   });
        // });
        for(let i=data[0].coversationInfo.length-1;i>=0;i--)
        {
            this.convinfo.unshift({
            $id:data[0].coversationInfo[i].$id,
            msgBroadcast:data[0].coversationInfo[i].msgBroadcast,
            msgDeleted:data[0].coversationInfo[i].msgDeleted,
            msgEdited:data[0].coversationInfo[i].msgEdited,
            msgFileName:data[0].coversationInfo[i].msgFileName,
            msgFileType:data[0].coversationInfo[i].msgFileType,
            msgId:data[0].coversationInfo[i].msgId,
            msgMessage:data[0].coversationInfo[i].msgMessage,
            msgNeedAttenstion:data[0].coversationInfo[i].msgNeedAttenstion,
            msgNeedAttenstionBy:data[0].coversationInfo[i].msgNeedAttenstionBy,
            msgReadStatus:data[0].coversationInfo[i].msgReadStatus,
            msgRecieverId:data[0].coversationInfo[i].msgRecieverId,
            msgSenderCCode:data[0].coversationInfo[i].msgSenderCCode,
            msgSenderId:data[0].coversationInfo[i].msgSenderId,
            msgSenderName:data[0].coversationInfo[i].msgSenderName,
            msgType:data[0].coversationInfo[i].msgType,
            msggroupType:data[0].coversationInfo[i].msggroupType,
            selectedMsg:data[0].coversationInfo[i].selectedMsg,
            selectedMsgFileName:data[0].coversationInfo[i].selectedMsgFileName,
            selectedMsgFileType:data[0].coversationInfo[i].selectedMsgFileType,
            selectedMsgId:data[0].coversationInfo[i].selectedMsgId,
            selectedMsgSender:data[0].coversationInfo[i].selectedMsgSender,
            slectedMsgSenderId:data[0].coversationInfo[i].slectedMsgSenderId,
            ts:data[0].coversationInfo[i].ts,
            dt:this.convertToDate(data[0].coversationInfo[i].ts)
          });
          this.highLightReply_array.unshift(false);
        //  this.content.scrollTo(0,10,2000);
        }
             //this.gomoenv.stopLoading();
        //

      }//end for if
      else{
        event.enable(false);
      }
      event.complete();
      console.log("convinfo",this.convinfo);
    })
  //}
}

 openReadInfo_Broadcast(conv)
 {
   let modal=this.modalctrl.create("BroadcastReadInfo",{"uid":this.loggedinUserId,"convid":this.convuser.convid,"msgid":conv.msgId});
   modal.present();
 }
 acknowledgeBroadcast(conv)
 {
   let str="";
   str+="<convoInfo>";
   str+="<loggedInUserId>"+this.loggedinUserId+"</loggedInUserId>";
   str+="<convoId>"+this.convuser.convid+"</convoId>";
   str+="<acknTo>0</acknTo>";
   str+="<projectId>0</projectId>";
   str+="<msgId>"+conv.msgId+"</msgId>";
   str+="</convoInfo>";
   this.gomoservice.AcknowledgeBroadCast(str).subscribe(data=>{
     if(data[0].errId==0)
     {
      this.convinfo[0].msgNeedAttenstionBy=this.loggedinUserId;
     }
   })

 }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 /******************************************************************SignalR-Calling Methods********************************************************************************************************** */
 ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 callSignalr_sendMessage()
 {
   let toUserid=0;
  toUserid=this.convType.toUpperCase()=="G"?0:this.convuser.toid;
  let str="<convoInfo>";
  str+="<groupId>"+this.convuser.groupid+"</groupId>";
  str+="	<convoId>"+this.convuser.convid+"</convoId>";
  str+="<loggedInUserId>"+this.loggedinUserId+"</loggedInUserId>";
  str+="<userId>"+toUserid+"</userId>";
  str+="<connectionId>"+this.gomoenv.signalrConnectionId+"</connectionId>"
  str+="</convoInfo>";
this.signalr.sendMessage_signalR(str).subscribe(data=>{
console.log("SignalRR",data);
    })

 }
 txtareaChange()
 {
   this.callsignalR_sendTyping("true","typing");
   setTimeout(()=>{
    this.gomoenv.isTyping=false;
   },60000)
 }
 txtareaBlur()
 {
   this.callsignalR_sendTyping("false","typing");
 }
callsignalR_sendTyping(status,msgType)
{
  let toUserid=0;
  toUserid=this.convType.toUpperCase()=="G"?0:this.convuser.toid;
  let convinfo="<convoInfo>";
  convinfo+="<groupId>"+this.convuser.groupid+"</groupId>";
  convinfo+="<convoId>"+this.convuser.convid+"</convoId>";
  convinfo+="<loggedInUserId>"+this.loggedinUserId+"</loggedInUserId>";
  convinfo+="<userId>"+toUserid+"</userId>";
  convinfo+="<connectionId>"+this.gomoenv.signalrConnectionId+"</connectionId>";
  convinfo+="</convoInfo>";
  
this.signalr.sendTyping_signalR(convinfo,this.convuser.groupid,status,this.loggedinUserId,msgType).subscribe((data)=>{
  console.log("Done Typing",data);
})

}



/******************************************************************************************************************** */
 /////////////////////////////////////////Signal-R//////////////////////////////////////////////////////////////////////
 private subscribeToEvents():void{
 
  this.signalr.connectionEstablished.subscribe(()=>{
    this.canSendMessage=true;
    console.log("Connection",this.canSendMessage);
  });

  this.signalr.messageReceived.subscribe(data=>{
      this.ngZone.run(async ()=>{
        console.log("signalr data",data.convinfo);
        let parser=new DOMParser();
        
        let xmlDoc=parser.parseFromString(data.convinfo,"application/xml");
        console.log("xmldoc",xmlDoc);
        let convid_signalr=xmlDoc.getElementsByTagName("convoId")[0].childNodes[0].nodeValue;
        if(convid_signalr==this.convuser.convid && this.gomoenv.pageid==2)
        {
          console.log('convi page called');
          //this.loadData();
         await this.appendData();
          
        }
      })
  });
  this.signalr.typing.subscribe(data=>{
    this.ngZone.run(()=>{
      console.log("Typing data",data);
       if(data.groupId==this.convuser.convid)
       {
         if(data.type.toLowerCase()=="typing")
         {
          if(data.typingStatus=="true")
          this.typing=true;
          else
          this.typing=false;
         }
         else
         {
          this.convinfo.forEach(element => {
               element.msgReadStatus='R'
           });
         }
       }
    })
  })

}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/************************************************************************************************************************************************** */
//////////////////////////////////////FCM Notification///////////////////////////////////////////////////////////////////////////////////////////////

GetTokenAndGenerateNotification(msgbody)
{
  let convid=(this.convuser.groupid==0)?this.newconv_convid:this.convuser.groupid
  let str="<deviceTokenInfo>";
  str+="<userId>"+this.loggedinUserId+"</userId>";
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
      if(this.convType.trim().toUpperCase()=="G")
        {
          from_name=from_name+" in "+this.convuser.name;
        }
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
      convoId: this.convuser.convid,
      convoImage: this.convuser.img,
      convoName: this.convuser.name,
      groupCType: "R",
      groupId:this.convuser.groupid,
      groupType:this.convuser.convtype,
      isFav: true,
      isMute: false,
      isPublic: false,
      lastFType: "",
      lastFileName: "",
      lastMsg: "",
      lastMsgStatus: "",
      lastMsgTime: "",
      logStatus:this.convuser.status,
      msgFromId:this.convuser.toid,
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
    this.message="";
  })

    }//end for if
    
  })


}




ionViewDidEnter(){
  this.gomoenv.isdeleteorclear="";
  console.log("Check Page ID1: "+this.gomoenv.pageid);
  if(this.gomoenv.pageid==3)
  {
    this.isMute=this.gomoenv.isMute_global;
  }
  this.gomoenv.pageid=2;
  console.log("Check Page ID2: "+this.gomoenv.pageid);

}
readconversation_info()
{
  let str="";
    str +="<getConversation>"
    str +="<loggedInUserId>"+this.loggedinUserId+"</loggedInUserId>"
    str +="<projectId>0</projectId>"
    str +="<convoId>"+this.convuser.convid+"</convoId>"
    str +="</getConversation>"
    
    this.gomoservice.ReadConversationInfo(str).subscribe(res=>{
       console.log(res);
    });

}

getBroadcast(){
  this.navCtrl.push("broadcast", {uid:this.loggedinUserId})
}

  createNewConv()
  {
    this.navCtrl.push("newconv",{uid:this.loggedinUserId});
  }

  changeddlFoolterOptions(value)
  {
    this.showPopover_footer=!this.showPopover_footer;
    if(value=="camera")
    {
      this.takepicture();
    }
    else if(value=="media")
    {
      this.selectFromGallery();
    }
    else if(value=="doc")
    {
      this.openFile();
    }
  
   
  }


/**********************************************Camera Methods*************************************************************************** */
takepicture() {
  this.camera.getPicture({
    quality: 75,
    destinationType: this.camera.DestinationType.DATA_URL,
    sourceType: this.camera.PictureSourceType.CAMERA,
    allowEdit: true,
    encodingType: this.camera.EncodingType.JPEG,
    targetWidth: 800,
    targetHeight: 800,
    saveToPhotoAlbum: false,
    correctOrientation:true
  }).then(imageData => {
    this.base64string = 'data:image/jpeg;base64,' + imageData;
    this.imageData= imageData;
    this.gomoenv.startLoading();
    let today=new Date();
    let filename=today.getMonth()+1+""+today.getDay()+""+today.getFullYear()+""+today.getHours()+""+today.getMinutes()+""+today.getSeconds()+".jpeg";
    this.gomoservice.SaveFiles(filename,this.base64string).subscribe(res=>{
     console.log("savedata",res);
     let finalfilename:any=res[0].filename;
     let toUserid=0;
     toUserid=this.convType.toUpperCase()=="G"?0:this.convuser.toid;
     this.gomoservice.UploadFiles(this.convuser.convid,finalfilename,"jpeg",this.convuser.groupid,this.loggedinUserId,toUserid)
                                                                          .subscribe(async data=>{
                                                                            console.log("uploaddata",data);
                                                                            this.GetTokenAndGenerateNotification("Sent an image");
                                                                           // this.loadData();
                                                                         await  this.appendData();
                                                                           this.getDocsData();
                                                                            this.callSignalr_sendMessage();
                                                                          })
    });

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
    this.gomoenv.startLoading();
    let today=new Date();
    let filename=today.getMonth()+1+""+today.getDay()+""+today.getFullYear()+""+today.getHours()+""+today.getMinutes()+""+today.getSeconds()+".jpeg";
    this.gomoservice.SaveFiles(filename,this.base64string).subscribe(res=>{
     console.log("savedata",res);
     let finalfilename:any=res[0].filename;
     let toUserid=0;
     toUserid=this.convType.toUpperCase()=="G"?0:this.convuser.toid;
     this.gomoservice.UploadFiles(this.convuser.convid,finalfilename,"jpeg",this.convuser.groupid,this.loggedinUserId,toUserid)
                                                                          .subscribe(async data=>{
                                                                            console.log("uploaddata",data);
                                                                            this.GetTokenAndGenerateNotification("Sent an image");
                                                                           // this.loadData();
                                                                         await  this.appendData();
                                                                           this.getDocsData();
                                                                            this.callSignalr_sendMessage();
                                                                          })
    });

  }, error => {
    console.log("ERROR -> " + JSON.stringify(error));
  });
}
/********************************************************************************************************************************************** */




}//end for page
