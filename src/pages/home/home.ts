import { LocalNotifications } from '@ionic-native/local-notifications';
import { SignalRServiceProvider } from './../../providers/signal-r-service/signal-r-service';

import {Component, NgZone, ViewChild} from '@angular/core'

import { IonicPage, NavController, NavParams, List, ToastController, AlertController, Item, ModalController, Content } from 'ionic-angular';
import { GomoEnvironment } from '../../common/gomoenvironmnet';
import { GomoServiceProvider } from '../../providers/gomo-service/gomo-service';
import { ItemSliding } from 'ionic-angular';

import {NativeStorage} from '@ionic-native/native-storage';
/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@IonicPage({
  name:'1'
})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
   @ViewChild('pageTop') pageTop:Content
   ;
  convlist:any=[];
  imgurl1:any;
  imgurl2:any;
  gimgurl:any;
  gimgurl2:any;
  showPopover:boolean=false;
  public searchtxt:string="";

  convlistcount:any=0;
  convnewlistcount:any=0;
  convtype = 1;
  convnewlist:any;
  sortstatus = 'A';
  loginUid:any=0;
  public canSendMessage: Boolean;
  showPopover2:any=[];
  userGroupList:any = [];
   lblArch:any="";
   sortvar:any="MLR";
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
      public gomoenv:GomoEnvironment,
      public gomoserv:GomoServiceProvider,
      public toastController: ToastController,
      public alertCtrl: AlertController,
      public signalr:SignalRServiceProvider,
      private ngZone:NgZone,
      private modalctrl:ModalController,
     private storage:NativeStorage,
     private localNotifications:LocalNotifications  
   
      ) {   
        this.gomoenv.pageid =1;
        this.imgurl1=this.gomoenv.imgurl+'Membersusers/';
        this.imgurl2=this.gomoenv.imgurl+'Membersusers/avatar.png';
        this.gimgurl=this.gomoenv.imgurl+'GroupIcons/';
        this.gimgurl2=this.gomoenv.imgurl+'GroupIcons/people.png';
        this.loginUid=this.navParams.get("LoginID");
        console.log(this.loginUid);
        this.subscribeToEvents();
       
      }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    //this.gomoenv.CheckNetwork_Connection();
    this.bindconversations();
  }
   filetr(list:any)
   {
    return list.filter(item=>{
      return item.convoLastEnryReadStatus.trim()=='Y'
    })
   }

   loadallchats()
   {
     this.gomoenv.startLoading();
     this.gomoenv.isall_convlist=true;
     this.bindconversations();
   }

  bindconversations()
  {
  
    let val=this.gomoenv.CheckNetwork_Connection();
      if(val==true)
      {
        this.searchtxt="";
        this.sortvar="MLR";
        let searchstr:any="";
        searchstr +="<getConvoInfo>"
        searchstr +="<loggedInUserId>"+this.loginUid+"</loggedInUserId>"
        searchstr +="<projectId>0</projectId>"
        searchstr +="<tagFormType></tagFormType>"
        searchstr +="<tagTitle></tagTitle>"
        searchstr +="<loadOnlyUNR>A</loadOnlyUNR>"
        searchstr +="<loadByFormBased>N</loadByFormBased>"
        searchstr +="</getConvoInfo>"
      
        this.gomoserv.GetConversationlist(searchstr).subscribe(data=>{
         this.convlist=[];
          let convlist:any=[],tagslist:any=[];
          convlist=this.filetr(data[0].convoInfo);
          tagslist=(data[0].convoTagInfo);

          let length=(this.gomoenv.isall_convlist==true)?data[0].convoInfo.length:4;
          let i=0
          convlist.forEach(element => {
              if(i<=length)
              this.convlist.push({
              id:element.id,
              convoDesg:element.convoDesg,
              convoGroupType:element.convoGroupType,
              convoId:element.convoId,
              convoImage:element.convoImage,
              convoLFType:element.convoLFType,
              convoLastEnryBy:element.convoLastEnryBy,
              convoLastEnryDate:element.convoLastEnryDate,
              convoLastEnryMSGStatus:element.convoLastEnryMSGStatus,
              convoLastEnryReadStatus:element.convoLastEnryReadStatus,
              convoLastEnrySeq: element.convoLastEnrySeq,
              convoLastEnryTime:element.convoLastEnryTime,
              convoLastFile:element.convoLastFile,
              convoLastMsg: element.convoLastMsg,
              convoMail: element.convoMail,
              convoName:element.convoName,
              convoNotifyStatus: element.convoNotifyStatus,
              convoRole:element.convoRole,
              convoUnreadMsgCount: element.convoUnreadMsgCount,
              groupId: element.groupId,
              groupType:element.groupType,
              isFavorite:element.isFavorite,
              isPublic:element.isPublic,
              projectId: element.projectId,
              userId: element.userId,
              typing:false,
              tagTitle:"",
              tagCCode:"",
              tagCount:""
            })
            i++;
          });
 
       for(let i=0;i<tagslist.length;i++)
       {
         this.convlist.forEach(element => {
              if(element.convoId==tagslist[i].tagCId)
              {
                element.tagTitle=tagslist[i].tagTile;
                element.tagCCode=tagslist[i].tagCCode;
                element.tagCount=tagslist[i].tagCount
              }
         });
       }

          this.convlistcount = this.convlist.length;
          this.storage.setItem('convlist',this.convlist).then(()=>{
            console.log("stored list");
          });
          console.log("received data:", this.convlist);
        });
       
      }
      else
      {
        this.searchtxt="";
        this.storage.getItem("convlist").then((data)=>{
          console.log("offline data",data);
        let convlist:any=data;
        convlist.forEach(element => {
          this.convlist.push({
            id:element.id,
            convoDesg:element.convoDesg,
            convoGroupType:element.convoGroupType,
            convoId:element.convoId,
            convoImage:element.convoImage,
            convoLFType:element.convoLFType,
            convoLastEnryBy:element.convoLastEnryBy,
            convoLastEnryDate:element.convoLastEnryDate,
            convoLastEnryMSGStatus:element.convoLastEnryMSGStatus,
            convoLastEnryReadStatus:element.convoLastEnryReadStatus,
            convoLastEnrySeq: element.convoLastEnrySeq,
            convoLastEnryTime:element.convoLastEnryTime,
            convoLastFile:element.convoLastFile,
            convoLastMsg: element.convoLastMsg,
            convoMail: element.convoMail,
            convoName:element.convoName,
            convoNotifyStatus: element.convoNotifyStatus,
            convoRole:element.convoRole,
            convoUnreadMsgCount: element.convoUnreadMsgCount,
            groupId: element.groupId,
            groupType:element.groupType,
            isFavorite:element.isFavorite,
            isPublic:element.isPublic,
            projectId: element.projectId,
            userId: element.userId,
            typing:false,
            tagTitle:element.tagTitle,
            tagCCode:element.tagCCode,
            tagCount:element.tagCount
          })
        });
        this.convlistcount=this.convlist.length;
        })
       
      }
   
  }
  changeddlUserOptions(value)
   {
     console.log("value changed to",value)
     this.showPopover=!this.showPopover
   }

   archiveconv(listconv:ItemSliding,convid:any){
    if(this.gomoenv.CheckNetwork_Connection()==true){
      this.presentConfirm('Archive',convid,'A',listconv);
    
    }
   
   }
   delconv(listconv:ItemSliding,convid:any){
    if(this.gomoenv.CheckNetwork_Connection()==true){
    this.presentConfirm('Delete',convid,'D',listconv);
    
    }
    
   }
  gotoconv(conitem,flag)
  {
    if(this.gomoenv.CheckNetwork_Connection()==true){
     this.gomoenv.convstartLoading();
      let resp={};
      let str="";
      str+="<getConversation>";
      str+="<convoId>"+conitem.convoId+"</convoId>";
      str+=" <loggedInUserId>"+this.loginUid+"</loggedInUserId>";
      str+="</getConversation>";
        this.gomoserv.GetConversationInfo(str).subscribe((data:any)=>{
          console.log("received data-home",data);
          data=data.length>0?data:[];
          //  if(data.length>0)
          //  {
             if(flag==1)
            {
              resp={'convoId':conitem.convoId,'groupId':conitem.groupId,
              'projectId':conitem.projectId,'userId':conitem.userId,
              'convoName':conitem.convoName,'convoImage':conitem.convoImage,
              'convoRole':conitem.convoRole, 'convtype':conitem.groupType,
               'loginid':this.loginUid,'dataobj':data};
            }
            else
            {
              resp={'convoId':conitem.conversationId,'groupId':conitem.groupId,
              'projectId':conitem.projectId,'userId':conitem.userId,
              'convoName':conitem.converationName,'convoImage':conitem.converationImage,
              'convoRole':conitem.converationRole, 'convtype':conitem.groupType,
               'loginid':this.loginUid,'dataobj':data};
            }
         
              conitem.convoUnreadMsgCount=0;
             //  this.gomoenv.stopLoading();
             
          // }
           this.navCtrl.push('2',{convobj:resp});
          });
      
 // alert('convid:'+resp
    }
  }


  presentConfirm(title,convid,flag,listconv){
  
    let alert = this.alertCtrl.create({
      title: 'Confirm '+title,
      message: 'Do you want to '+title+' this conversation?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
              console.log('cancel clicked');
             listconv.close();
          }
        },
        {
          text: 'Yes',
          handler: () => {
            listconv.close();
            let strstring="";
                 strstring +='<convoInfo>'
                 strstring +='<convoId>'+convid+'</convoId>'
                 strstring +='<loggedInEmpId>'+this.loginUid+'</loggedInEmpId>'
                 if(flag!='D')
                 strstring +='<isArchive>'+flag+'</isArchive>'
                 
                 strstring +='</convoInfo>'
  
            if(flag=='A' || flag=='Y')
              {
               
                this.gomoserv.ArchiveConvi(strstring).subscribe(data=>{
                  console.log(data);
                  let msg='';
                  if(data[0].errId==0)
                    msg='success'
                    else
                    msg='failed!'
                  // this.toastController.create({
                  //   message:msg,
                  //   duration: 3000
                  this.gomoenv.startLoading3();
                  this.bindconversations();
                 
                })
              }
              if(flag=='D')
              {
                this.gomoenv.startLoading3();
                this.gomoserv.DeleteConv(strstring).subscribe(data=>{
                  console.log(data);
                  let msg='';
                  if(data[0].errId==0)
                    msg='success'
                    else
                    msg='failed!'
                  // this.toastController.create({
                  //   message:msg,
                  //   duration: 3000
                  // }).present();
                 
                  this.bindconversations();
                 
                });
  
              }
          }
        }
      ]
    });
    
    alert.present();
    
  }

  getnewlist(){
    // this.presentLoading();
 
     this.convtype = 2;
     let newstr:any="";
     newstr +="<getConvoInfo>"
     newstr +="<loggedInUserId>"+this.loginUid+"</loggedInUserId>"
     newstr +="<projectId>0</projectId>"
     newstr +="<tagFormType></tagFormType>"
     newstr +="<tagTitle></tagTitle>"
     newstr +="<loadOnlyUNR>N</loadOnlyUNR>"
     newstr +="<loadByFormBased>N</loadByFormBased>"
     newstr +="</getConvoInfo>"
 
     this.gomoserv.GetNewConversationlist(newstr).subscribe(data=>{
       console.log(data);       
 
       var ulist = [];
       var ugrouplist = [];
       data.filter(function(e){ 
         if(e.groupType.replace(/\s+/g, '') == 'I'){
           ulist.push(e);    
         }else if(e.groupType.replace(/\s+/g, '') == '' || e.groupType.replace(/\s+/g, '') == null){
           ulist.push(e); 
         }else if(e.groupType.replace(/\s+/g, '') == 'G'){
           ugrouplist.push(e);
         }
       });
 
       this.convnewlist = ulist;
       this.userGroupList = ugrouplist;
 
       this.convnewlistcount = this.convnewlist.length;
 
       
       this.convnewlist.sort(function(a, b){
         var nameA=a.converationName.toLowerCase().replace(/ /g,'');
         var nameB=b.converationName.toLowerCase().replace(/ /g,'');  
               
         if (nameA < nameB) //sort string ascending
          return -1;
         if (nameA > nameB)
          return 1;
         return 0; //default return value (no sorting)
        });
 
        console.log(this.convnewlist);
        console.log(this.userGroupList);
        
     });
   }
 

  //Back to contacts list
  backtoconv(){
    this.convtype = 1;
    this.bindconversations();
  }
//Alphabetical order  
conchar1 : any;
conchar2 : any;
getShortName(fullName) {    
  var fname = fullName.replace(/^\s+/g, '');
   this.conchar1 = fname.charAt(0).toUpperCase();
  if(this.conchar2 != this.conchar1){
    this.conchar2 = this.conchar1;
    return this.conchar1;
  }          
}

    //Sorting Asc/Desc
    clicksort(srt){    
      this.sortvar=srt;
      this.showPopover=!this.showPopover
      if(srt == 'A'){ 
       this.convlist=this.convlist.sort(this.compareValues('convoName','asc'));
        this.sortstatus = 'D';
      }else if(srt == 'D'){        
        this.convlist=this.convlist.sort(this.compareValues('convoName','desc'));
        this.sortstatus = 'A';
      }
      else if(srt == 'MLR'){        
        this.convlist=this.convlist.sort(this.compareValues('convoLastEnryTime','desc'));
      // this.loadallchats();
       this.sortstatus = 'MLR';
      }
      else if(srt == 'LMR'){        
       // this.convlist=this.convlist.sort(this.compareValues1('convoLastEnrySeq','desc'));
       this.convlist=this.convlist.sort(this.compareValues('convoLastEnryTime','desc'));
       this.convlist=this.convlist.reverse();
        this.sortstatus = 'LMR';
      }

      this.pageTop.scrollToTop();
      // setTimeout(() => {
      //   this.pageTop.scrollToTop();
      //   },1000);
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
  compareValues1(key, order) {
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
  leaveConversation(convid:any){
    if(this.gomoenv.CheckNetwork_Connection()==true){
     let strstring="";
     strstring += "<convoInfo>"
     strstring +="<loggedInUserId>"+this.loginUid+"</loggedInUserId>"
     strstring +="<convoId>"+convid+"</convoId>"
     strstring +="</convoInfo>"

              this.gomoserv.leaveConv(strstring).subscribe(res=>{
                   if(res[0].errId==0)
                   alert('success');
                   else
                   alert('Failed!');
              })
            }
      }
      popoverClick(conv,i,listconv:ItemSliding)
      {
        if(this.gomoenv.CheckNetwork_Connection()==true){
         if(i==1)//Archive
         {
           
          this.presentConfirm('Archive',conv.convoId,'A',listconv);
         }
        else if(i==8)//Unarchive
        {
          this.unArchiveConv(conv.convoId);
        }
        else if(i==2)//Favorite
        {
          this.makeFavAndUnfav(conv.convoId,'Y',conv.projectId)
        }
       else if(i==3)//Unfavorite
       {
        this.makeFavAndUnfav(conv.convoId,'N',conv.projectId)
       }
       else if(i==9)//Readall
       {
        let str="<msgInfo>";
        str+="<convoId>"+conv.convoId+"</convoId>";
        str+="<groupId>"+conv.groupId+"</groupId>";
        str+="<loggedInUserId>"+this.loginUid+"</loggedInUserId>"
        str+=" </msgInfo>";
       this.readAllMessages(str,conv.convoId);
       }
      else if(i==4)//Mute
      {
        this.muteConversation(conv,'N');
      }
     else if(i==5)//Cancel mute
     {
       this.muteConversation(conv,'Y');
     }
         else if(i==6)
         {
          // let str="<convoInfo>";
          // str+="<convoId>"+conv.convoId+"</convoId>";
          // str+="<loggedInEmpId>"+this.loginUid+"</loggedInEmpId>";
          // str+="</convoInfo>";
          this.presentConfirm('Delete',conv.convoId,'D',listconv);
          // this.gomoserv.DeleteConv(str).subscribe(data=>{
          //    this.bindconversations();
          // });
         }
         else if(i==7)
         {
           this.unReadConversation(conv);
         }
        }
      }


      readAllMessages(str,convid)
      {
       
        this.gomoserv.readAllMessageConvo(str).subscribe(data=>{
          console.log("read all messages done",data);
         // this.bindconversations();

         this.optionsreload(convid,"RAll");
        })
      }

  unArchiveConv(convid)
  {
    
    if(this.gomoenv.CheckNetwork_Connection()==true){
this.gomoenv.startLoading3();
    let strstring="";
                 strstring +='<convoInfo>'
                 strstring +='<convoId>'+convid+'</convoId>'
                 strstring +='<loggedInEmpId>'+this.loginUid+'</loggedInEmpId>'
                 strstring +='<isArchive>Y</isArchive>'
                 strstring +='</convoInfo>';
        this.gomoserv.ArchiveConvi(strstring).subscribe(data=>{
          this.bindconversations();
        });
      }
  }
  unArchiveConvslide(listconv:ItemSliding,convid:any)
  {
    if(this.gomoenv.CheckNetwork_Connection()==true){
      this.gomoenv.archdelstartLoading();
      let strstring="";
                   strstring +='<convoInfo>'
                   strstring +='<convoId>'+convid+'</convoId>'
                   strstring +='<loggedInEmpId>'+this.loginUid+'</loggedInEmpId>'
                   strstring +='<isArchive>Y</isArchive>'
                   strstring +='</convoInfo>';
          this.gomoserv.ArchiveConvi(strstring).subscribe(data=>{

            this.bindconversations();

            listconv.close();
          });
        }

  }
      makeFavAndUnfav(convid,flag,projectid)
      {
        if(this.gomoenv.CheckNetwork_Connection()==true){
        let str="<getConvoInfo>";
        str+="<loggedInUserId>"+this.loginUid+"</loggedInUserId>";
        str+="<projectId>"+projectid+"</projectId>";
        str+="<convoId>"+convid+"</convoId>";
        str+="<isFav>"+flag+"</isFav>"
        str+="</getConvoInfo>";
        this.gomoserv.MakeFavAndUnfav(str).subscribe(data=>{
          console.log("Fav",data,"Flag",flag);
        //  this.bindconversations();
        let optionflag=(flag=="Y")? "FAV":"UNFAV";
        this.optionsreload(convid,optionflag);
        })
      }

      }
      unReadConversation(conv)
      {
      let str="<msgInfo>";
      str+="<convoId>"+conv.convoId+"</convoId>";
      str+="<groupId>"+conv.groupId+"</groupId>";
      str+="<loggedInUserId>"+this.loginUid+"</loggedInUserId>";
      str+="</msgInfo>";
        this.gomoserv.UnReadConversation(str).subscribe(data=>{
            console.log("unread done",data);
            //this.bindconversations();
            this.optionsreload(conv.convoId,"UNR");
           // this.unreadMessageCount_header();
      })
     }
     unreadMessageCount_header()
    {
    let strstring="";
    strstring +="<convoInfo>"
    strstring +="<loggedInUserId>"+this.loginUid+"</loggedInUserId>"
    strstring +="<projectId>"+this.convlist.projectid+"</projectId>"
    strstring +="</convoInfo>"

             this.gomoserv.UnreadConvoCount(strstring).subscribe(res=>{
               this.gomoenv.Chat_count=res[0].errId;
             });
    }

    muteConversation(conv,flag)
    {
      let str="<convoInfo>";
      str+="<loggedInUserId>"+this.loginUid+"</loggedInUserId>";
      str+="<convoId>"+conv.convoId+"</convoId>";
      str+="<isMuted>"+flag+"</isMuted>";
      str+="</convoInfo>";
      this.gomoserv.muteConversation(str).subscribe(data=>{
        let optionflag=(flag=="N")?"MUT":"UNMUT";
        this.optionsreload(conv.convoId,optionflag);
      });

    }
  copyConvinfo(info,tags)
  {
    let convlist:any=[],tagslist:any=[];
    this.convlist=[];
    convlist=info;
    tagslist=tags;
    convlist.forEach(element => {
      this.convlist.push({
        id:element.id,
        convoDesg:element.convoDesg,
        convoGroupType:element.convoGroupType,
        convoId:element.convoId,
        convoImage:element.convoImage,
        convoLFType:element.convoLFType,
        convoLastEnryBy:element.convoLastEnryBy,
        convoLastEnryDate:element.convoLastEnryDate,
        convoLastEnryMSGStatus:element.convoLastEnryMSGStatus,
        convoLastEnryReadStatus:element.convoLastEnryReadStatus,
        convoLastEnrySeq: element.convoLastEnrySeq,
        convoLastEnryTime:element.convoLastEnryTime,
        convoLastFile:element.convoLastFile,
        convoLastMsg: element.convoLastMsg,
        convoMail: element.convoMail,
        convoName:element.convoName,
        convoNotifyStatus: element.convoNotifyStatus,
        convoRole:element.convoRole,
        convoUnreadMsgCount: element.convoUnreadMsgCount,
        groupId: element.groupId,
        groupType:element.groupType,
        isFavorite:element.isFavorite,
        isPublic:element.isPublic,
        projectId: element.projectId,
        userId: element.userId,
        typing:false,
        tagTitle:"",
        tagCCode:"",
        tagCount:""
      })
    });

 for(let i=0;i<tagslist.length;i++)
 {
   this.convlist.forEach(element => {
        if(element.convoId==tagslist[i].tagCId)
        {
          element.tagTitle=tagslist[i].tagTile;
          element.tagCCode=tagslist[i].tagCCode;
          element.tagCount=tagslist[i].tagCount
        }
   });
 }
  }
    openAccordion()
    {
      this.lblArch="";
      //this.navCtrl.push('accordion',{'loginid':this.loginUid});
      let modal=this.modalctrl.create('accordion',
      {'loginid':this.loginUid},
      {
        enterAnimation: 'modal-translate-up-enter',
        leaveAnimation: 'modal-translate-up-leave'
      }
      
      );
      
      modal.present();
      modal.onDidDismiss((data=>{
        this.gomoenv.isall_convlist=true;
        if(typeof data=="undefined" || data.obj.flag=="0")
        {
                    this.gomoenv.startLoading3();
                    this.bindconversations();
        }
        else if(data.obj.flag=="CBU")
        {
          let searchstr:any="";
        searchstr +="<getConvoInfo>"
        searchstr +="<loggedInUserId>"+this.loginUid+"</loggedInUserId>"
        searchstr +="<projectId>0</projectId>"
        searchstr +="<tagFormType>CBU</tagFormType>"
        searchstr +="<tagTitle>"+data.obj.id+"</tagTitle>"
        searchstr +="<loadOnlyUNR>N</loadOnlyUNR>"
        searchstr +="<loadByFormBased>N</loadByFormBased>"
        searchstr +="</getConvoInfo>"
       
        this.gomoserv.GetConversationlist(searchstr).subscribe(data=>{
         this.copyConvinfo(data[0].convoInfo,data[0].convoTagInfo);
          this.convlistcount = this.convlist.length;
          console.log("received data:", this.convlist);
        });
        }
        else if(data.obj.flag=="CBG")
        {
          let searchstr:any="";
        searchstr +="<getConvoInfo>"
        searchstr +="<loggedInUserId>"+this.loginUid+"</loggedInUserId>"
        searchstr +="<projectId>0</projectId>"
        searchstr +="<tagFormType>CBG</tagFormType>"
        searchstr +="<tagTitle>"+data.obj.id+"</tagTitle>"
        searchstr +="<loadOnlyUNR>N</loadOnlyUNR>"
        searchstr +="<loadByFormBased>N</loadByFormBased>"
        searchstr +="</getConvoInfo>"
       
        this.gomoserv.GetConversationlist(searchstr).subscribe(data=>{
          this.copyConvinfo(data[0].convoInfo,data[0].convoTagInfo);
          this.convlistcount = this.convlist.length;
          console.log("received data:", this.convlist);
        });
        }
        else if(data.obj.flag=="TAGS")
        {
          let searchstr:any="";
          searchstr +="<getConvoInfo>"
          searchstr +="<loggedInUserId>"+this.loginUid+"</loggedInUserId>"
          searchstr +="<projectId>0</projectId>"
          searchstr +="<tagFormType>"+data.obj.options+"</tagFormType>"
          searchstr +="<tagTitle>"+data.obj.id+"</tagTitle>"
          searchstr +="<loadOnlyUNR>N</loadOnlyUNR>"
          searchstr +="<loadByFormBased>N</loadByFormBased>"
          searchstr +="</getConvoInfo>"
         
          this.gomoserv.GetConversationlist(searchstr).subscribe(data=>{
            this.copyConvinfo(data[0].convoInfo,data[0].convoTagInfo);
            this.convlistcount = this.convlist.length;
            console.log("received data:", this.convlist);
          });
        }
        else if(data.obj.flag=="TRK")
        {
          let searchstr:any="";
          searchstr +="<getConvoInfo>"
          searchstr +="<loggedInUserId>"+this.loginUid+"</loggedInUserId>"
          searchstr +="<projectId>0</projectId>"
          searchstr +="<tagFormType>TRK</tagFormType>"
          searchstr +="<tagTitle>"+data.obj.id+"</tagTitle>"
          searchstr +="<loadOnlyUNR>N</loadOnlyUNR>"
          searchstr +="<loadByFormBased>N</loadByFormBased>"
          searchstr +="</getConvoInfo>"
         
          this.gomoserv.GetConversationlist(searchstr).subscribe(data=>{
            this.copyConvinfo(data[0].convoInfo,data[0].convoTagInfo);
            this.convlistcount = this.convlist.length;
            console.log("received data:", this.convlist);
          });
        }
        else if(data.obj.flag=="PRJ")
        {
          let searchstr:any="";
          searchstr +="<getConvoInfo>"
          searchstr +="<loggedInUserId>"+this.loginUid+"</loggedInUserId>"
          searchstr +="<projectId>0</projectId>"
          searchstr +="<tagFormType>PRJ</tagFormType>"
          searchstr +="<tagTitle>"+data.obj.id+"</tagTitle>"
          searchstr +="<loadOnlyUNR>N</loadOnlyUNR>"
          searchstr +="<loadByFormBased>N</loadByFormBased>"
          searchstr +="</getConvoInfo>"
         
          this.gomoserv.GetConversationlist(searchstr).subscribe(data=>{
            this.copyConvinfo(data[0].convoInfo,data[0].convoTagInfo);
            this.convlistcount = this.convlist.length;
            console.log("received data:", this.convlist);
          });
        }
        else if(data.obj.flag=="arch")
        {
          let searchstr:any="";
        searchstr +="<getConvoInfo>"
        searchstr +="<loggedInUserId>"+this.loginUid+"</loggedInUserId>"
        searchstr +="<projectId>0</projectId>"
        searchstr +="<tagFormType></tagFormType>"
        searchstr +="<tagTitle></tagTitle>"
        searchstr +="<loadOnlyUNR>N</loadOnlyUNR>"
        searchstr +="<loadByFormBased>N</loadByFormBased>"
        searchstr +="</getConvoInfo>"
        this.gomoenv.startLoading3();
        this.gomoserv.GetConversationlist(searchstr).subscribe(data=>{
          let res=data[0].convoInfo;
           res= res.filter(item=>{
            return item.convoLastEnryReadStatus.trim()=='A'
          })
          if(res.length>0)
          {
            this.copyConvinfo(res,data[0].convoTagInfo);
         
            this.convlistcount = this.convlist.length;
            
          }
          else{
            this.convlist=[];
            this.lblArch="No Archived Chats";
          }
         
          console.log("received data:", this.convlist);
       //   this.gomoenv.startLoading();
        });
        }
        else if(data.obj.flag=="brd")
        {
          let searchstr:any="";
        searchstr +="<getConvoInfo>"
        searchstr +="<loggedInUserId>"+this.loginUid+"</loggedInUserId>"
        searchstr +="<projectId>0</projectId>"
        searchstr +="<tagFormType>BRD</tagFormType>"
        searchstr +="<tagTitle></tagTitle>"
        searchstr +="<loadOnlyUNR>N</loadOnlyUNR>"
        searchstr +="<loadByFormBased>N</loadByFormBased>"
        searchstr +="</getConvoInfo>"
        this.gomoenv.startLoading3();
        this.gomoserv.GetConversationlist(searchstr).subscribe(data=>{
         this.copyConvinfo(data[0].convoInfo,data[0].convoTagInfo);
          this.convlistcount = this.convlist.length;
          console.log("received data:", this.convlist);
         
        });
        }
      
      
      
      
      }))//modal dismiss
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
  
        let page=this.gomoenv.pageid;
        console.log("page",page);
          // if(page=="1" )
          // {s
            console.log('home  page called');
            let parser=new DOMParser();
            let xmlDoc=parser.parseFromString(data.convinfo,"application/xml");
            console.log("xmldoc",xmlDoc);
            let convid_signalr=xmlDoc.getElementsByTagName("convoId")[0].childNodes[0].nodeValue;
              //this.bindconversations();
              let dstr="";
              dstr+="<getConvoInfo>";
              dstr+="<loggedInUserId>"+this.loginUid+"</loggedInUserId>";
              dstr+="<projectId>0</projectId>";
              dstr+="<convoId>"+convid_signalr+"</convoId>";
              dstr+="</getConvoInfo>";
              this.gomoserv.getConvTags(dstr).subscribe(data=>{
                     console.log("received message from signalr",data.json());
                     let res=data.json();
                     let convlist:any={},tagslist:any=[];
                     convlist=res[0].convoInfo[0];
                     tagslist=res[0].convoTagInfo;
                      let exist=0;
                     this.convlist.forEach(element => {
                           if(element.convoId==convid_signalr)
                           {
                             exist=1;
                            element.id=convlist.id,
                            element.convoDesg=convlist.convoDesg,
                            element.convoGroupType=convlist.convoGroupType,
                            element.convoId=convlist.convoId,
                            element.convoImage=convlist.convoImage,
                            element.convoLFType=convlist.convoLFType,
                            element.convoLastEnryBy=convlist.convoLastEnryBy,
                            element.convoLastEnryDate=convlist.convoLastEnryDate,
                            element.convoLastEnryMSGStatus=convlist.convoLastEnryMSGStatus,
                            element.convoLastEnryReadStatus=convlist.convoLastEnryReadStatus,
                            element.convoLastEnrySeq= convlist.convoLastEnrySeq,
                            element.convoLastEnryTime=convlist.convoLastEnryTime,
                            element.convoLastFile=convlist.convoLastFile,
                            element.convoLastMsg= convlist.convoLastMsg,
                            element.convoMail= convlist.convoMail,
                            element.convoName=convlist.convoName,
                            element.convoNotifyStatus= convlist.convoNotifyStatus,
                            element.convoRole=convlist.convoRole,
                            element.convoUnreadMsgCount= convlist.convoUnreadMsgCount,
                            element.groupId= convlist.groupId,
                            element.groupType=convlist.groupType,
                            element.isFavorite=convlist.isFavorite,
                            element.isPublic=convlist.isPublic,
                            element.projectId= convlist.projectId,
                            element.userId= convlist.userId,
                            element.typing=false,
                            element.tagTitle=tagslist[0].tagTile,
                            element.tagCCode=tagslist[0].tagCCode,
                            element.tagCount=tagslist.length-1
                           }
                     });

                       if(exist==0){
                         this.bindconversations();
                       }


                  //      if(exist==1){
                  //    for(let i=0;i<tagslist.length;i++)
                  //    {
                  //     this.convlist.forEach(element => {
                  //       if(element.convoId==tagslist[i].tagCId)
                  //       {
                  //         element.tagTitle=tagslist[i].tagTile;
                  //         element.tagCCode=tagslist[i].tagCCode;
                  //         element.tagCount=tagslist[i].tagCount
                  //       }
                  //  });
                  //    }
                  //   }
              })

               this.convlist=this.convlist.sort(function(x,y){
                 return x.convoId==convid_signalr ? -1: y.convoId==convid_signalr ?1:0
               });


       //   }//end for if
          
      })
  })
  this.signalr.typing.subscribe(data=>{
    this.ngZone.run(()=>{
      console.log("Typing data",data);
     this.convlist.forEach(element => {
        if(element.groupId==data.groupId)
         {
          if(data.typingStatus=="true")
          {
            element.typing=true;
            this.gomoenv.isTyping=true;
          }
          else{
            element.typing=false;
            this.gomoenv.isTyping=false;
          }
         }
      });
     
    })
  })
}
     



    //Create New Group
    createNewGroup(){
      let profileModal = this.modalctrl.create("ForwardMsg", { 'uid':this.loginUid,'flag':'G'});
      profileModal.present();
      profileModal.onDidDismiss(data=>{
        if(typeof data=="undefined" || data.flag=="N")
        {
          this.gomoenv.isall_convlist=false; 
        }
        else
        {
            this.bindconversations();
        }
       })
    }

//  //Brodacast Page
//  getBroadcast(){
//   let profileModal = this.modalctrl.create("broadcast", {uid:this.loginUid});
//   profileModal.present();
// }

ionViewDidEnter(){
 
  console.log("Check Page ID: "+this.gomoenv.pageid);
  if(this.gomoenv.isdeleteorclear=="C")
  {
    this.gomoenv.startLoading();
    // this.convlist.forEach(element => {
    //   if(element.convoId==this.gomoenv.globleconvid)
    //    {
    //     this.gomoenv.isdeleteorclear="";
    //     element.convoLastMsg='';
    //    }
    // });
    this.bindconversations();
  }
  else    if(this.gomoenv.isdeleteorclear=="D"){
    for(let i=0;i<this.convlist.length;i++){
      if(this.convlist[i].convoId==this.gomoenv.globleconvid)
       {
         this.convlist.splice(i,1);
       }
    }
  }
  else if(this.gomoenv.isTyping==true)
  {
    this.gomoenv.isTyping=false;
    for(let i=0;i<this.convlist.length;i++){
      this.convlist[i].typing=false;
      if(this.convlist[i].convoId==this.gomoenv.globleconvid)
       {
         this.convlist[i].typing=true;
       }
    }
    this.gomoenv.globleconvid=0;
  }
  else{
  if(this.gomoenv.pageid == 2){
   let conid= this.gomoenv.globleconvid;
   this.gomoenv.globleconvid=0;
   this.gomoenv.pageid =1;
   let dstr="";
   dstr+="<getConvoInfo>";
   dstr+="<loggedInUserId>"+this.loginUid+"</loggedInUserId>";
   dstr+="<projectId>0</projectId>";
   dstr+="<convoId>"+conid+"</convoId>";
   dstr+="</getConvoInfo>";
   this.gomoserv.getConvTags(dstr).subscribe(data=>{
          console.log("received message from signalr",data.json());
          let res=data.json();
          let convlist:any={},tagslist:any=[];
          convlist=res[0].convoInfo[0];
           tagslist=(res[0].convoTagInfo);
          this.convlist.forEach(element => {
                if(element.convoId==conid)
                {
                 element.id=convlist.id,
                 element.convoDesg=convlist.convoDesg,
                 element.convoGroupType=convlist.convoGroupType,
                 element.convoId=convlist.convoId,
                 element.convoImage=convlist.convoImage,
                 element.convoLFType=convlist.convoLFType,
                 element.convoLastEnryBy=convlist.convoLastEnryBy,
                 element.convoLastEnryDate=convlist.convoLastEnryDate,
                 element.convoLastEnryMSGStatus=convlist.convoLastEnryMSGStatus,
                 element.convoLastEnryReadStatus=convlist.convoLastEnryReadStatus,
                 element.convoLastEnrySeq= convlist.convoLastEnrySeq,
                 element.convoLastEnryTime=convlist.convoLastEnryTime,
                 element.convoLastFile=convlist.convoLastFile,
                 element.convoLastMsg= convlist.convoLastMsg,
                 element.convoMail= convlist.convoMail,
                 element.convoName=convlist.convoName,
                 element.convoNotifyStatus= convlist.convoNotifyStatus,
                 element.convoRole=convlist.convoRole,
                 element.convoUnreadMsgCount= convlist.convoUnreadMsgCount,
                 element.groupId= convlist.groupId,
                 element.groupType=convlist.groupType,
                 element.isFavorite=convlist.isFavorite,
                 element.isPublic=convlist.isPublic,
                 element.projectId= convlist.projectId,
                 element.userId= convlist.userId,
                 element.typing=false,
                 element.tagTitle=(tagslist.length>0)?tagslist[0].tagTile:"",
                 element.tagCCode=(tagslist.length>0)?tagslist[0].tagCCode:"",
                 element.tagCount=(tagslist.length>0)?tagslist.length-1:0
                }
          });
        //   for(let i=0;i<tagslist.length;i++)
        //   {
        //    this.convlist.forEach(element => {
        //      if(element.convoId==tagslist[i].tagCId)
        //      {
            
        //        element.tagTitle=tagslist[i].tagTile;
        //        element.tagCCode=tagslist[i].tagCCode;
        //        element.tagCount=tagslist[i].tagCount
        //      }
        // });
        //   }
   })
        if(this.gomoenv.ismsgsend==true){
         this.convlist=this.convlist.sort(function(x,y){
      return x.convoId==conid ? -1: y.convoId==conid ?1:0
           });
           this.gomoenv.ismsgsend=false;
        }
 }
}
}


optionsreload(conid:any,flag:any){
  this.convlist.forEach(element => {
    if(element.convoId==conid)
     {
          if(flag=="FAV"){
            element.isFavorite="Y";
          }
         else if(flag=="MUT"){
            element.convoNotifyStatus="N"
          }
          else if(flag=="UNR"){
            element.convoUnreadMsgCount=1;
          }
          else if(flag=="UNFAV"){
            element.isFavorite="N";
          }
          else if(flag=="UNMUT"){
            element.convoNotifyStatus="Y"
          }

          else if(flag=="RAll"){
            element.convoUnreadMsgCount=0;
          }
     }
  });
   
}

//Get Count of users list
getLength(uarry,uobject){
  
   if(uarry == 0){
      this.convlistcount = 1
   }else if(uarry > 0){
      this.convlistcount = uarry + 1;
   }else if(uarry == -1){
      this.convlistcount = 0;
   }
}
    }//end for app
