import { SignalRServiceProvider } from './../../providers/signal-r-service/signal-r-service';
import { Camera } from '@ionic-native/camera';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ActionSheetController, ModalController } from 'ionic-angular';
import { GomoServiceProvider } from '../../providers/gomo-service/gomo-service';
import { FilePath } from '@ionic-native/file-path';
import {File} from '@ionic-native/file';
import { GomoEnvironment } from '../../common/gomoenvironmnet';
import { Slides } from 'ionic-angular';

import { Events } from 'ionic-angular';
import { DomSanitizer} from '@angular/platform-browser';
/**
 * Generated class for the MessengeraboutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name:'AboutPage'
})
@Component({
  selector: 'page-messengerabout',
  templateUrl: 'messengerabout.html',
})
export class MessengeraboutPage {

  headerishide : boolean = true;
  aboutgroup :boolean = true ;
  aboutperson : boolean = false;
  docsdiv :boolean = false;
  mediadiv : boolean = false;

  grpname :boolean = true;
  Editedgrpname : boolean = false;
  groupName :string="";

  abtdivcolor: string ; //default color
  docsdivcolor: string ;
  mediadivcolor: string;
  abtfontclr : string;
  docsfontclr : string;
  mediafontclr :string;

  Messengergroupinfo = [];
  Messengergroupuserinfo =[];
  Messengergroupuserinfo_par =[];
  MessengergroupIndividualinfo = [];
  individual_email:any="";
  MessengerDocsdata =[];

  mediafileDocs = [];
  mediafileImages =[];
  pre : any = -1;

  loggedinUserId:any=0;
  navdata:any={};
  chkMutegrp :boolean = false;
  chkMutechat :boolean = false;
  groupiconsurl:string="https://devapi.usegomo.com/Images/GroupIcons/";
  usericonurl:string="https://devapi.usegomo.com/Images/Membersusers/";
  apifileurl: string;
  imageData :any;
  photoTaken: boolean = false;
  photoSelected: boolean;
  base64string:string="";
  imgview :boolean =false;
  isMute:boolean=false;
  hide_leftarrow:boolean=false;
  hide_rightarrow:boolean=false;
  @ViewChild('slides') slides: Slides;
   docsdata1=[];
   docsview :boolean = false;
   docfilename : any;
   iframeurl : string;
   

  constructor(public navCtrl: NavController, 
    public navParams: NavParams , 
    private messengerservice : GomoServiceProvider , 
    public toastCtrl :ToastController,
    private camera:Camera,
    private actionSheetController:ActionSheetController,
    private modalctrl:ModalController ,
    private file:File,
     private filepath:FilePath,
     private gomoenv:GomoEnvironment,
     private signalr:SignalRServiceProvider,
     private sanitizer: DomSanitizer
     ) {
      this.iframeurl = "https://docs.google.com/gview?url=https://devapi.usegomo.com/Images/CommFiles/";
    this.navdata=this.navParams.get('data');
    console.log("received data from conv page::",this.navdata);
   this.loggedinUserId=this.navdata.loginid;
   this.groupiconsurl="https://devapi.usegomo.com/Images/GroupIcons/";
       this.usericonurl="https://devapi.usegomo.com/Images/Membersusers/"; 
       this.apifileurl="https://devapi.usegomo.com/Images/CommFiles/";
     //  this.getData();
 //   this. about();
    this.gomoenv.pageid=3;
    this.gomoenv.isMute_global=false;
    // let currentIndex = this.slides.getActiveIndex();
    // console.log(currentIndex);

 if(this.navdata.pagetype == 'D')
 {
  this.Docs();   
  this.headerishide = false;
 }
 else{
  this. about();
  this.headerishide = false;
 }
 

  }

  getData()
  {
    this.Messengergroupinfo=[];
    this.Messengergroupuserinfo=[];
    this.Messengergroupuserinfo_par=[];
    this.MessengergroupIndividualinfo=[];
    this.MessengerDocsdata=[];
    this.mediafileDocs=[];
    this.mediafileImages=[]; 
    let str  = "";
    str += "<getGroupInfo>";
    str += "<loggedInUserId>"+this.loggedinUserId+"</loggedInUserId>"
    str += "<groupUserId>"+this.navdata.toid+"</groupUserId>"        
    str += "<groupId>"+this.navdata.groupid+"</groupId>"
    str += "<projectId>"+this.navdata.projectid+"</projectId>"
    str += "</getGroupInfo>"

    this.messengerservice.getGroupDetails(str).subscribe(response =>{
      this.Messengergroupinfo = response[0].groupInformation;
      this.groupName=this.Messengergroupinfo[0].groupName;
      this.Messengergroupuserinfo = response[0].groupUserInfo;
      this.Messengergroupuserinfo_par=this.Messengergroupuserinfo;
      this.MessengergroupIndividualinfo = response [0].groupIndividualInfo; 
      if(this.navdata.convtype.trim().toUpperCase()=='G' || this.navdata.convtype.trim().toUpperCase()=='B')
      {
        this.Messengergroupuserinfo=this.Messengergroupuserinfo.filter(item=>{
          return item.userAdded.toUpperCase()=='Y';
        })
        this.individual_email="";
      }
      else{
        this.individual_email=this.MessengergroupIndividualinfo[0].eMail;
      }  
      
      
      this.MessengerDocsdata = response[0].groupMediaInfo; 
     this.docsdata1.push( this.MessengerDocsdata); 
      //console.log( this.Messengergroupinfo);
      //console.log(this.Messengergroupuserinfo);       

      if(this.Messengergroupinfo[0].groupType== "I")
      {
       this.aboutgroup = false;
       this.aboutperson = true;
       this.docsdiv = false;
       this.mediadiv = false;
       this.chkMutechat=this.Messengergroupinfo[0].notifyStaus.toUpperCase()=='N'?true:false;
      }
      else if(this.Messengergroupinfo[0].groupType== "G") {
       this.aboutgroup = true;
       this.aboutperson = false;
       this.docsdiv = false;
       this.mediadiv = false;
       this.chkMutegrp=this.Messengergroupinfo[0].notifyStaus.toUpperCase()=='N'?true:false;
      }
      this.imgview = false;
      
      this.docsdata();


    })  

  }

  about()
  {      
    this.getData();
    this.abtdivcolor ='#2295cd';
    this.docsdivcolor ='#d3d6db';
    this.mediadivcolor ='#d3d6db';

    this.abtfontclr = '#fff';
    this.docsfontclr ='#000';
    this.mediafontclr ='#000';
  
  }

   

  Docs()
  {
    
    this.abtdivcolor ='#d3d6db';
    this.docsdivcolor ='#2295cd';
    this.mediadivcolor ='#d3d6db';    
    this.abtfontclr = '#000';
    this.docsfontclr ='#fff';
    this.mediafontclr ='#000';

    this.aboutgroup = false;
    this.aboutperson = false;
    this.docsdiv = true;
    this.mediadiv = false;
    this.imgview = false;  
    this.docsdata();


  }

  Media()
  {
    
    this.docsview = false;
    this.abtdivcolor ='#d3d6db';
    this.docsdivcolor ='#d3d6db';
    this.mediadivcolor ='#2295cd';
    
    this.abtfontclr = '#000';
    this.docsfontclr ='#000';
    this.mediafontclr ='#fff';
    this.aboutgroup = false;
    this.aboutperson = false;
    this.docsdiv = true;
   // this.mediadiv = true;
    this.imgview = false; 
    this.hide_rightarrow=false;
  }


  opendocs (filename)
  {
   //this.docfilename = this.iframeurl + filename;
   //this.docfilename = this.sanitizer.bypassSecurityTrustResourceUrl(this.iframeurl + filename +'&embedded=true');
   this.docfilename = this.sanitizer.bypassSecurityTrustResourceUrl('https://docs.google.com/gview?url=https%3A%2F%2Fdevapi.usegomo.com%2FImages%2FCommFiles%2F'+ filename+'&embedded=true')
   this.docsdiv= false;
   this.docsview = true;
   console.log(this.iframeurl + this.docfilename);
  }


  // docsdata()
  // {
  //   var docsdata=[];
  //    docsdata. push( this.MessengerDocsdata); 
     
  
  //     for(var i = 0;i<docsdata[0].length; i++)
  //     {
  //       var msgtype= docsdata[0][i].fileType;
  //        if ( msgtype =="pdf" || msgtype =="doc" || msgtype =="docx"|| msgtype =="xlsx" || msgtype =="xls"  )
  //        {
  //         this.mediafileDocs.push({ 
  //           'filename': docsdata[0][i].filename,
  //           'time': docsdata[0][i].fileTs,
  //           'filetype':docsdata[0][i].fileType
  //          });
  //          this.mediafileDocs=this.mediafileDocs.sort(this.compareValues('time','desc'));
  //          console.log(this.mediafileDocs);
  //        }
  //        else 
  //        {
  //          this.mediafileImages.push({
  //           'filename': docsdata[0][i].filename,
  //           'time': docsdata[0][i].fileTs,
  //           'filetype':docsdata[0][i].fileType
  //          });
  //          this.mediafileImages=this.mediafileImages.sort(this.compareValues('time','desc'));
  //          console.log(this.mediafileImages);
  //        }
  //     }
  //  }



  docsdata()
  {
   // var docsdata=[];
   //  docsdata. push( this.MessengerDocsdata); 

   let str  = "";
   str += "<getGroupInfo>";
   str += "<loggedInUserId>"+this.loggedinUserId+"</loggedInUserId>"
   str += "<groupUserId>"+this.navdata.toid+"</groupUserId>"        
   str += "<groupId>"+this.navdata.groupid+"</groupId>"
   str += "<projectId>"+this.navdata.projectid+"</projectId>"
   str += "</getGroupInfo>"

   this.messengerservice.getGroupDetails(str).subscribe(response =>{
    if(this.navdata.convtype.trim().toUpperCase()=='G' || this.navdata.convtype.trim().toUpperCase()=='B' || this.navdata.convtype.trim().toUpperCase()=='I')
    {        
    this.MessengerDocsdata = response[0].groupMediaInfo; 
    this.docsdata1.push( this.MessengerDocsdata); 
   
    for(var i = 0;i<this.docsdata1[0].length; i++)
    {
      var msgtype= this.docsdata1[0][i].fileType;
     
       if ( msgtype =="pdf" || msgtype =="doc" || msgtype =="docx"|| msgtype =="xlsx" || msgtype =="xls"  )
       {
        this.mediafileDocs.push({ 
          'filename':this. docsdata1[0][i].filename,
          'time': this.docsdata1[0][i].fileTs,
          'filetype': this.docsdata1[0][i].fileType
         });
         this.mediafileDocs=this.mediafileDocs.sort(this.compareValues('time','desc'));
         console.log(this.mediafileDocs);
       }
       else 
       {
         
         this.mediafileImages.push({
          'filename':this.docsdata1[0][i].filename,
          'time': this.docsdata1[0][i].fileTs,
          'filetype':this.docsdata1[0][i].fileType,
         

         });
       
         this.mediafileImages=this.mediafileImages.sort(this.compareValues('time','desc'));
         if(this.mediafileImages.length>0)
         {
            let i=0;
            this.mediafileImages.forEach(element => {
              element.index=i
              i++
            });
         }
         console.log(this.mediafileImages);
       }
    }

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
editGroupname()
{
   this.grpname = false;
   this.Editedgrpname = true;

}
noSpace(event)
{
   if(event.value == " ")
   {
     alert("No spaces are allowed");
     event.value=event.value.replace(/^\s+/,"");
   }
  
}

saveGroupname()
{
  let toast :any;
  var str = "";
   var name = this.groupName.trim();                                                            
   str += "<changeGroupName>";
   str += "<groupId>"+this.navdata.groupid+"</groupId>";
   str += "<groupName> "+ name +"</groupName>";
   str += "<loggedInUserId>"+this.loggedinUserId+"</loggedInUserId>";
   str += "</changeGroupName>"

 this.messengerservice.saveChangedname(str).subscribe(response =>{

  if(response[0].errId==1){
    let convid =this.Messengergroupinfo[0].convoId;
    this.grpname = true;
    this.Editedgrpname = false;
   this.about();
   this.callSignalr_sendMessage(convid);
   toast =this.toastCtrl.create({
      message :'Group Name Changed',
      duration :3000
    });
    
  }
  else{
    toast =this.toastCtrl.create({
      message :'Group Name Not Changed',
      duration :3000
    });
  }
  toast.present(); 

 });   
}


muteConv()
{
  this.isMute=false;
  var chk ="";
 if( this.chkMutegrp == true)
 {  chk = "Y"; } else {chk ="N";}


  var str = "";
                                                           
  str += "<convoInfo>";
  str += "<loggedInUserId>"+ this.loggedinUserId +"</loggedInUserId>"
  str += "<convoId> "+ this.Messengergroupinfo[0].convoId +"</convoId>";
  str += "<isMuted>"+ chk +"</isMuted>";
  str += "</convoInfo>";

 this.messengerservice.muteConversation(str).subscribe(response =>{
  // console.log("Group muted");
  this.isMute=chk=="Y"?true:false;
  this.gomoenv.isMute_global=chk=="Y"?true:false;
 });

}


muteChat(e)
{
  this.isMute=false;
  var chk ="";
 if(e.target.checked==true )
 {  chk = "N"; } else {chk ="Y";}

  var str = "";                                                           
  str += "<convoInfo>";
  str += "<loggedInUserId>"+ this.loggedinUserId +"</loggedInUserId>"
  str += "<convoId> "+ this.Messengergroupinfo[0].convoId +"</convoId>";
  str += "<isMuted>"+ chk +"</isMuted>";
  str += "</convoInfo>";

 this.messengerservice.muteConversation(str).subscribe(response =>{
  // console.log("Group muted");
  this.isMute=chk=="N"?true:false;
  this.gomoenv.isMute_global=chk=="N"?true:false;
 });
}

addparticipants()
{

}
docsback()
{
  this.navParams.get("parentPage").appendData();
  this.navCtrl.pop();
}

  aboutback()
  {

    this.navParams.get("parentPage").isMute=this.isMute==true?true:false;
    this.navParams.get("parentPage").appendData();
    let unames:any="";
    if( this.Messengergroupuserinfo.length>0)
    {
      this.Messengergroupuserinfo.forEach(element => {
        unames+=element.userName+',';
      });
      unames=unames.slice(0,-1);
    }
    else{
      unames="";
    }
    if(this.Messengergroupinfo[0].groupType.trim()== "G"){
    this.navParams.get("parentPage").convuser={
      convid:this.Messengergroupinfo[0].convoId,
      groupid:this.Messengergroupinfo[0].groupId,
      name:this.groupName,
      toid:0,
      status:unames,
      img:this.Messengergroupinfo[0].groupImage,
      projectid:0,
      convtype:"G",
      loginid:this.loggedinUserId
    };
    console.log("nav",this.navParams.get("parentPage").convuser)
  }
      this.navCtrl.pop();
    
    
  }

  
/**********************************************Camera Methods*************************************************************************** */
takepicture() {
  this.camera.getPicture({
    quality: 75,
    destinationType: this.camera.DestinationType.FILE_URI,
    sourceType: this.camera.PictureSourceType.CAMERA,
    allowEdit: true,
    encodingType: this.camera.EncodingType.JPEG,
    targetWidth: 800,
    targetHeight: 800,
    saveToPhotoAlbum: false
  }).then( async imageData => {
    this.base64string = 'data:image/jpeg;base64,' + imageData;
   // this.emplogo=this.base64string;
  
  let indexOfLash = imageData.lastIndexOf('/') + 1;
  let name = imageData.substr(indexOfLash);
  let namePath = imageData.substr(0, indexOfLash);
  let imgs=[];
   console.log("name:",name,":namepath",namePath);
   let response:any = await  new Promise((resolve, reject)=>{  
    let fileUrl = imageData;            
    window['resolveLocalFileSystemURL'](fileUrl,(FileEntry:any) => {
      console.log(FileEntry);
      FileEntry.file((File) => {
        console.log(File);
        let reader = new FileReader();
        reader.onloadend = (evt: any) => {
          let imgBlob: any = new Blob([new Uint8Array(evt.target.result)],{type:'image/png'});
          imgBlob.name = File.name;
          imgs.push(imgBlob);
          console.log(evt);
          resolve(imgBlob);
        };
        reader.readAsArrayBuffer(File);
        reader.onerror = (e) =>{
          console.log('Failed file read:'+e.toString());
          reject(e);
        };
        
      });
    });
  });

 let formData=new FormData();
formData.append("uploadFile_0",imgs[0],imgs[0].name);
formData.append("groupid",this.Messengergroupinfo[0].groupId);
formData.append("folder","GroupIcons");
formData.append("userid",this.loggedinUserId);
    this.photoTaken = true;
    this.photoSelected = false;
    this.messengerservice.UploadGroupImages(formData).subscribe(data=>{
      console.log("response",data);
      let convid =this.Messengergroupinfo[0].convoId;
      this.about();
      this.callSignalr_sendMessage(convid);
    })
  }, error => {
    console.log("ERROR -> " + JSON.stringify(error));
});
}


selectFromGallery() {
  this.camera.getPicture({
    quality: 75,
    destinationType: this.camera.DestinationType.FILE_URI,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    allowEdit: true,
    encodingType: this.camera.EncodingType.JPEG,
    targetWidth: 800,
    targetHeight: 800,
    saveToPhotoAlbum: false,
    correctOrientation:true,
    
  }).then( async imageData => {
    this.base64string = 'data:image/jpeg;base64,' + imageData;
    let indexOfLash = imageData.lastIndexOf('/') + 1;
    let name = imageData.substr(indexOfLash);
    let namePath = imageData.substr(0, indexOfLash);
    let imgs=[];
     console.log("name:",name,":namepath",namePath);
     let response:any = await  new Promise((resolve, reject)=>{  
      let fileUrl = imageData;            
      window['resolveLocalFileSystemURL'](fileUrl,(FileEntry:any) => {
        console.log(FileEntry);
        FileEntry.file((File) => {
          console.log(File);
          let reader = new FileReader();
          reader.onloadend = (evt: any) => {
            let imgBlob: any = new Blob([new Uint8Array(evt.target.result)],{type:'image/png'});
            imgBlob.name = File.name;
            imgs.push(imgBlob);
            console.log(evt);
            resolve(imgBlob);
          };
          reader.readAsArrayBuffer(File);
          reader.onerror = (e) =>{
            console.log('Failed file read:'+e.toString());
            reject(e);
          };
          
        });
      });
    });
  
   let formData=new FormData();
  formData.append("uploadFile_0",imgs[0],imgs[0].name);
  formData.append("groupid",this.Messengergroupinfo[0].groupId);
  formData.append("folder","GroupIcons");
  formData.append("userid",this.loggedinUserId);
      this.photoTaken = true;
      this.photoSelected = false;
      this.messengerservice.UploadGroupImages(formData).subscribe(data=>{
        console.log("response",data);
        let convid =this.Messengergroupinfo[0].convoId;
        this.about();
        this.callSignalr_sendMessage(convid);
      })     




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
        cssClass:'buttoncss' ,
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

participants()
{
  let modal=this.modalctrl.create("participants",{users:this.Messengergroupuserinfo_par,loginid:this.loggedinUserId,convid:this.navdata.groupid,groupname:this.Messengergroupinfo[0].groupName});
  modal.present();
  modal.onDidDismiss((data)=>{
   if(typeof data=="undefined")
   {

   } 
   else{
    this.Messengergroupuserinfo=data.users.filter(item=>{
      return item.userAdded.toUpperCase()=='Y';
    })
   }   
    

    // this.navParams.get("parentPage").appendData();
    // this.navCtrl.pop();
  })
}

prevslide()
{
  let currentIndex = this.slides.getActiveIndex();
  console.log(currentIndex);
  if(currentIndex == 1){
    this.pre = -1;
  }else{
    this.pre = currentIndex;
  }
  
  this.slides.slidePrev();
  this.hide_rightarrow=false;
}

nextslide()
{
  let currentIndex = this.slides.getActiveIndex();
  console.log(currentIndex);

  this.pre = currentIndex;
  
  this.slides.slideNext();
  if(this.slides.isEnd()==true)
    this.hide_rightarrow=true;
  else
    this.hide_rightarrow=false;
}

  gotoSlide(num)
{
  let currentIndex = this.slides.getActiveIndex();
  this.pre = currentIndex;
  this.slides.slideTo(num);
  if(this.slides.isEnd()==true)
    this.hide_rightarrow=true;
  else
    this.hide_rightarrow=false;
}
  
  opengallery(imgfile)
{  
 this.imgview =true;
 //this. mediadiv = false;
  this.docsdiv= false;
  console.log("imagefile",imgfile);
    if(imgfile.index>0)
    {
      this.gomoenv.startLoading3();
        setTimeout(()=>{
          this.gotoSlide(imgfile.index);
         
        },1000)
    }
     

}



 goToChat(userconv)
 {
  let resp={};
  let str="";
  str+="<getConversation>";
  str+="<convoId>"+userconv.convoId+"</convoId>";
  str+=" <loggedInUserId>"+this.loggedinUserId+"</loggedInUserId>";
  str+="</getConversation>";
    this.messengerservice.GetConversationInfo(str).subscribe((data:any)=>{
      console.log("received data-messengerabout",data);
      data=data.length>0?data:[];
      resp={
        'convoId':userconv.convoId,'groupId':userconv.groupId,
      'projectId':0,'userId':userconv.userId,
      'convoName':userconv.userName,'convoImage':userconv.userImage,
      'convoRole':"Offline", 'convtype':'I',
       'loginid':this.loggedinUserId,'dataobj':data
      };
       console.log("object notification",resp)
       this.navCtrl.push('2',{convobj:resp});
    });

}//end for goto


 callSignalr_sendMessage(convid)
 {
   let toUserid=0;
  let str="<convoInfo>";
  str+="<groupId>"+this.navdata.groupid+"</groupId>";
  str+="	<convoId>"+convid+"</convoId>";
  str+="<loggedInUserId>"+this.loggedinUserId+"</loggedInUserId>";
  str+="<userId>"+toUserid+"</userId>";
  str+="<connectionId>"+this.gomoenv.signalrConnectionId+"</connectionId>"
  str+="</convoInfo>";
this.signalr.sendMessage_signalR(str).subscribe(data=>{
console.log("SignalRR",data);
    })

 }

LeaveGroup()
{
   let str="";
   str+="<convoInfo>";
   str+="<loggedInUserId>"+this.loggedinUserId+"</loggedInUserId>";
   str+=" <convoId>"+this.Messengergroupinfo[0].convoId+"</convoId>";
   str+="</convoInfo>";
   this.messengerservice.leaveConv(str).subscribe((data)=>{
     if(data[0].errId==1)
     {
      let resp={};
      let str="";
      str+="<getConversation>";
      str+="<convoId>"+this.Messengergroupinfo[0].convoId+"</convoId>";
      str+=" <loggedInUserId>"+this.loggedinUserId+"</loggedInUserId>";
      str+="</getConversation>";
        this.messengerservice.GetConversationInfo(str).subscribe((data:any)=>{
          console.log("received data-messengerabout",data);
          data=data.length>0?data:[];
          resp={
            'convoId':this.Messengergroupinfo[0].convoId,
            'groupId':this.Messengergroupinfo[0].groupId,
          'projectId':0,'userId':0,
          'convoName':this.Messengergroupinfo[0].groupName,
          'convoImage':this.Messengergroupinfo[0].groupImage,
          'convoRole':"Offline",
           'convtype':'G',
           'loginid':this.loggedinUserId,
           'dataobj':data
          };
          this.navParams.get("parentPage").convuser={
            convid:this.Messengergroupinfo[0].convoId,
            groupid:this.Messengergroupinfo[0].groupId,
            name:this.Messengergroupinfo[0].groupName,
            toid:0,
            status:"",
            img:this.Messengergroupinfo[0].groupImage,
            projectid:0,
            convtype:'G',
            loginid:this.loggedinUserId,
            dataobj:data
          }
          this.navParams.get("parentPage").loadData();
          //this.navCtrl.pop();
          this.navCtrl.setRoot("1",{LoginID:this.loggedinUserId});
        });
     }
   })
}


}//end for page
