import { IonicImageCacheConfig } from 'ionic3-image-cache';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { GomoServiceProvider } from '../../providers/gomo-service/gomo-service';
import { GomoEnvironment } from '../../common/gomoenvironmnet';
/**
 * Generated class for the NewConversationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name:'newconv'
})
@Component({
  selector: 'page-new-conversations',
  templateUrl: 'new-conversations.html',
})
export class NewConversationsPage {

loginUid:any="";
convnewlist:any=[];
userGroupList:any=[];
convnewlistcount:any="";
public searchtxt:string="";
def_img:any="";
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private gomoserv:GomoServiceProvider,
    private gomoenv:GomoEnvironment,
    private modalctrl:ModalController,
    private imgconfig:IonicImageCacheConfig

    ) {
    this.loginUid=this.navParams.get("uid");
    this.gomoenv.pageid="newconv";
    this.imgconfig.AltData="No Image";
    this.imgconfig.alt="assets/icon/gpeople.png";
    this.def_img="assets/icon/gpeople.png";
    
  }

  ionViewDidLoad() {
   this.getnewlist();
  }

  getnewlist(){
    // this.presentLoading();
 
     
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
        this.userGroupList.sort(function(a, b){
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
   gotoconv(conitem,flag)
   {
     if(this.gomoenv.CheckNetwork_Connection()==true){
        this.gomoenv.startLoading();
       let resp={};
       let str="";
       str+="<getConversation>";
       str+="<convoId>"+conitem.conversationId+"</convoId>";
       str+=" <loggedInUserId>"+this.loginUid+"</loggedInUserId>";
       str+="</getConversation>";
         this.gomoserv.GetConversationInfo(str).subscribe((data:any)=>{
           console.log("received data-home",data);
           data=data.length>0?data:[];
            // if(data.length>0)
            // {
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

 //Create New Group
 createNewGroup(){
  let profileModal = this.modalctrl.create("ForwardMsg", { 'uid':this.loginUid,'flag':'G'});
  profileModal.present();
  profileModal.onDidDismiss(data=>{
    if(typeof data=="undefined" || data.flag=="N")
    {
                
    }
    else
    {
        this.navCtrl.setRoot("1",{LoginID:this.loginUid});
    }
   })
}
backtoconv()
{
  this.navCtrl.setRoot("1",{LoginID:this.loginUid});
}

onImageLoad(event)
{
  console.log("image loadevent",event)
}
}//end for page
