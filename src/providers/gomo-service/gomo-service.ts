import { UtcConvertPipe } from './../../pipes/utc-convert/utc-convert';
//import { HttpClient } from '@angular/common/http';
import { Injectable} from '@angular/core';
import {Http,RequestOptions,Response, Headers} from '@angular/http';
import { GomoEnvironment } from '../../common/gomoenvironmnet';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';

/*
  Generated class for the GomoServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GomoServiceProvider {
    headerobj:any;
    private getReadObserver: any;
    public getRead: any;
  constructor( private http: Http,public gomoenv:GomoEnvironment) {
    
    this.getReadObserver = null;
    this.getRead = Observable.create(observer => {
        this.getReadObserver = observer;
    });
  }

 
  private setHeader(): Headers {
    const headersConfig = new Headers();
    headersConfig.append('Content-type', 'application/json');
    headersConfig.append('Accept', 'application/json');
    return headersConfig;
  }

  gomouserlogin(userid,pcode,fcmtoken){

     const header=this.setHeader();
     header.append('strUserId', `${userid}`);
     header.append('strPasscode', `${pcode}`);
     
    const obj = {
      strIpAddress: '10.10.10.12',
      strLogType: 'M',
      strDeviceType: '',
      strDeviceToken:fcmtoken,
      strMemberId: 0,
      strLinkedUserId: 0
    };

   const options=new RequestOptions({headers:header});

       return  this.http.post(this.gomoenv.API_url+"UserLogin",obj,options)
                         .map((res:Response)=>res.json())
   }

    GetConversationlist(strstring:any)
   {

    let options=new RequestOptions({headers:this.gomoenv.headers});
    let body={
         "strSearchString":strstring
        }
           
        return  this.http.post(this.gomoenv.API_url+"/MessengerConversationInfo",body,options)
                         .map((res:Response)=>res.json())
   }
  
   GetConversationInfo(searchString)
   {
    let options=new RequestOptions({headers:this.gomoenv.headers});
    let body={ "strSearchString":searchString }
     return  this.http.post(this.gomoenv.API_url+"/ConversationInfo",body,options)
                         .map((res:Response)=>res.json())

   }

  LoadMoreconversations(str)
  {
    let options=new RequestOptions({headers:this.gomoenv.headers});
    let body={ "strSearchString":str }
     return  this.http.post(this.gomoenv.API_url+"/MoreConversationInfo",body,options)
                         .map((res:Response)=>res.json())
  }

   getConvTags(data){
    //Get Conv and Tags Object
  
    let options=new RequestOptions({headers:this.gomoenv.headers});
    let body={ "strSearchString":data }
    return  this.http.post(this.gomoenv.API_url+"/MessengerConversationbyIDInfo",body,options)
    .map((res:Response)=>res)
   }

   createConversationTags(data){
    let options=new RequestOptions({headers:this.gomoenv.headers});
    let body={"strSearchString":data}
    return  this.http.post(this.gomoenv.API_url+"/CreateConversationTag",body,options)
    .map((res:Response)=>res.json())
   }

   addtags(data){
    //Get Conv and Tags Object
    let options=new RequestOptions({headers:this.gomoenv.headers});
    let body={ "strSearchString":data }
    return  this.http.post(this.gomoenv.API_url+"AddCommTags",body,options)
    .map((res:Response)=>res.json());
   }
   
   sendMessage(fromuserid,touserid,message,groupid,convid,projectid,msgid)
   {
      let options=new RequestOptions({headers:this.gomoenv.headers});
    let body={
      "FromUserid":fromuserid,
      "ToUserid": touserid,
      "Msgid": msgid,
      "Message": message,
      "GroupId":groupid,
      "ConversationId":convid,
      "ProjectId": projectid,
      "msgType": "M",
      "tagFormType": "",
      "tagTitle": ""
    }
    return  this.http.post(this.gomoenv.API_url+"MessengerNew",body,options)
    .map((res:Response)=>res.json());
   }

   ArchiveConvi(strstring:any){
      let options=new RequestOptions({headers:this.gomoenv.headers});
      let body={
        "strSearchString":strstring
      }
           return this.http.post(this.gomoenv.API_url+"ArchiveConvo",body,options)
           .map((res:Response)=>res.json());
   }

   DeleteConv(strstring:any){
    let options=new RequestOptions({headers:this.gomoenv.headers});
    let body={
      "strSearchString":strstring
    }
         return this.http.post(this.gomoenv.API_url+"DeleteConvo",body,options).
         map((res:Response)=>res.json());
 }
 GetNewConversationlist(strstring:any)
 {

  let options=new RequestOptions({headers:this.gomoenv.headers});
  let body={
       "strSearchString":strstring
      }
     
      return  this.http.post(this.gomoenv.API_url+"/MessengerContactInfo",body,options)
                       .map((res:Response)=>res.json());
            
 }

 leaveConv(strstring:any)
 {

  let options=new RequestOptions({headers:this.gomoenv.headers});
  let body={
       "strSearchString":strstring
      }
     
      return  this.http.post(this.gomoenv.API_url+"LeftConvo",body,options)
                       .map((res:Response)=>res.json());
            
 }

 clearConvo(strstring:any)
 {

  let options=new RequestOptions({headers:this.gomoenv.headers});
  let body={
       "strSearchString":strstring
      }
     
      return  this.http.post(this.gomoenv.API_url+"ClearConvo",body,options)
                       .map((res:Response)=>res.json());
            
 }

 assignFavoriteConvo(strstring:any)
 {

  let options=new RequestOptions({headers:this.gomoenv.headers});
  let body={
       "strSearchString":strstring
      }
     
      return  this.http.post(this.gomoenv.API_url+"AssignFavoriteConvo",body,options)
                       .map((res:Response)=>res.json());
 }

 readAllMessageConvo(strstring:any)
 {

  let options=new RequestOptions({headers:this.gomoenv.headers});
  let body={
       "strSearchString":strstring
      }
     
      return  this.http.post(this.gomoenv.API_url+"ReadAllMessageConvo",body,options)
                       .map((res:Response)=>{
                         res.json()
                        this.getReadObserver.next(res.json())
                        });
 }
 
 GetConversationContactInfo(searchString)
    {
      let options=new RequestOptions({headers:this.gomoenv.headers});
    let body={
      "strSearchString":searchString
    }
         return this.http.post(this.gomoenv.API_url+"MessengerContactInfo",body,options).
         map((res:Response)=>res);
  }
   EditMessage(msg,msgid)
   {
    let options=new RequestOptions({headers:this.gomoenv.headers});
    let body={
      "msg":msg,
      "msgid":msgid
    };
     return this.http.post(this.gomoenv.API_url+"EditMessage",body,options)
                     .map((res:Response)=>res.json())

   }
   
   UnReadMessage(str)
   {
    let options=new RequestOptions({headers:this.gomoenv.headers});
    let body={
      "strSearchString":str
    }
         return this.http.post(this.gomoenv.API_url+"UnreadConvoMsg",body,options).
         map((res:Response)=>res);
   }

   UnReadConversation(str)
   {
    let options=new RequestOptions({headers:this.gomoenv.headers});
    let body={
      "strSearchString":str
    }
         return this.http.post(this.gomoenv.API_url+"UnreadConvo",body,options).
         map((res:Response)=>res.json());
   }

   
   DeleteMessage(str)
   {
    let options=new RequestOptions({headers:this.gomoenv.headers});
    let body={
      "strSearchString":str
    }
         return this.http.post(this.gomoenv.API_url+"DeleteMsg",body,options).
         map((res:Response)=>res);
   }
   UnreadConvoCount(str)
   {
    let options=new RequestOptions({headers:this.gomoenv.headers});
    let body={
      "strSearchString":str
    }
         return this.http.post(this.gomoenv.API_url+"UnreadConvoCount",body,options).
         map((res:Response)=>res.json());
   }

  
   getGroupDetails(searchstring)
   {
 
       let body = {"strSearchString" : searchstring }
       console.log(body);
       let options = new RequestOptions({headers :this.gomoenv.headers})
      return this.http.post(this.gomoenv.API_url+'GroupDetails',body,options) .map((res:Response) =>res.json());
 
   }
 
 
   saveChangedname(searchstring)
   {
     let body = {"strSearchString" :searchstring }
     let options = new RequestOptions({headers : this.gomoenv.headers})
     return this.http.post(this.gomoenv.API_url+'ChangeGroupName',body,options) .map((res:Response) =>res.json());
   }
   muteConversation(searchstring)
   {
     let body = {"strSearchString" :searchstring }
     let options = new RequestOptions({headers : this.gomoenv.headers})
     return this.http.post(this.gomoenv.API_url+'MuteConvo',body,options) .map((res:Response) =>res.json());
   
   }

   MakeFavAndUnfav(str)
   {
    let body = {"strSearchString" :str }
    let options = new RequestOptions({headers : this.gomoenv.headers})
    return this.http.post(this.gomoenv.API_url+'AssignFavoriteConvo',body,options) .map((res:Response) =>res.json());
   } 

  Search_Accordion(str)
  {
    let body = {"strSearchString" :str }
    let options = new RequestOptions({headers : this.gomoenv.headers})
    return this.http.post(this.gomoenv.API_url+"SearchFormData",body,options) .map((res:Response) =>res.json());
  }
 
  SaveFiles(filename,image)
  {
    let body:any=[{
      "filename":filename,
      "folder":"CommFiles",
      "image":image
     }]
    let options = new RequestOptions({headers : this.gomoenv.headers})
    return this.http.post(this.gomoenv.API_url+"Savefilesfrombase64",body,options) .map((res:Response) =>res.json());
  }

  UploadFiles(convid,filename,filetype,groupid,fromuid,touid)
  {
    let body={
      "convid": convid,
      "filename": filename,
      "filetype": filetype,
      "formtype": "",
      "groupid": groupid,
      "message": "",
      "msgfromuserid": fromuid,
      "msgtouserid": touid,
      "projectid": 0,
      "selectedmsgid": 0,
      "tagtitle": ""
    }
    let options = new RequestOptions({headers : this.gomoenv.headers})
    return this.http.post(this.gomoenv.API_url+"UploadMessengerMedia",body,options) .map((res:Response) =>res.json());
  }


  CreateMessengerGroup(str)
  {
    let body = {"strSearchString" :str }
    let options = new RequestOptions({headers : this.gomoenv.headers})
    return this.http.post(this.gomoenv.API_url+"CreateMessengerGroup",body,options) .map((res:Response) =>res.json());
  }
  CreateMemberUserDeviceToken(str:any){
    let body = {"strSearchString" :str }
    let options = new RequestOptions({headers : this.gomoenv.headers})
    return this.http.post(this.gomoenv.API_url+"CreateMemberUserDeviceToken",body,options) .map((res:Response) =>res.json());
  }

  ForwardMessage(convid,fromid,groupid,message,msgid,projectid,toid)
  {
    let body = {
      "ConversationId": convid,
      "FromUserid": fromid,
      "GroupId": groupid,
      "Message": message,
      "Msgid": msgid,
      "ProjectId":projectid, 
      "ToUserid": toid,
      "msgType": "F"


    }
    let options = new RequestOptions({headers : this.gomoenv.headers})
    return this.http.post(this.gomoenv.API_url+"MessengerV2",body,options) .map((res:Response) =>res.json());
  }
  
  // UploadGroupImages(imgdata,groupid,userid)
  UploadGroupImages(formData)
  {
    
    let options = new RequestOptions({headers : this.gomoenv.headers})
    return this.http.post(this.gomoenv.API_url+"uploadGroupImages",formData,options) .map((res:Response) =>res.json());

  }

  /*****************Add/Remove Participants*********************** */
  AddParticipant(str)
  {
    let body={
      strSearchString:str
    }
    let options = new RequestOptions({headers : this.gomoenv.headers})
    return this.http.post(this.gomoenv.API_url+"AddUserToConversation",body,options) .map((res:Response) =>res.json());
  }
  RemoveParticipant(str)
  {
    let body={
      strSearchString:str
    }
    let options = new RequestOptions({headers : this.gomoenv.headers})
    return this.http.post(this.gomoenv.API_url+"RemoveUserFromComm",body,options) .map((res:Response) =>res.json());
  }
  saveprofiledata( formdata )
  {
   // let body = {"data" :formdata}
   let options = new RequestOptions({headers : this.gomoenv.headers})
   return this.http.post('https://devapi.usegomo.com/api/uploadProfileData',formdata,options ).map((res:Response)=> res.json());
  }
  CreateBroadCast(userdtobj)
  {
    let body = userdtobj
    let options = new RequestOptions({headers : this.gomoenv.headers})
    return this.http.post(this.gomoenv.API_url+"BroadcastMessage",body,options) .map((res:Response) =>res.json());
  }
  GetUserProfileData(str)
  {
    let body={
      strSearchString:str
    }
    let options = new RequestOptions({headers : this.gomoenv.headers})
    return this.http.post(this.gomoenv.API_url+"UserDetails",body,options) .map((res:Response) =>res.json());
  }
  
  GetFcmToken(str)
  {
    let body={
      strSearchString:str
    }
    let options = new RequestOptions({headers : this.gomoenv.headers})
    return this.http.post(this.gomoenv.API_url+"MemberUserDeviceTokenbyGroup",body,options) .map((res:Response) =>res.json());
  }
  
  GenerateNotification_FCM(body)
  {
    const header=this.setHeader();
     header.append('Authorization', 'key=AIzaSyB8gmKXh8isgtUYeXrJZgBJynFyrSNb640');
    let options = new RequestOptions({headers : header})
    return this.http.post("https://fcm.googleapis.com/fcm/send",body,options) .map((res:Response) =>res.json());
  }



  Convotagsinfo(searchString)
  {
    let options=new RequestOptions({headers:this.gomoenv.headers});
  let body={
    "strSearchString":searchString
  }
       return this.http.post(this.gomoenv.API_url+"Convotags",body,options).
       map((res:Response)=>res.json());
}

  CountConversation_TagsAndDocs(searchString)
  {
    let options=new RequestOptions({headers:this.gomoenv.headers});
  let body={
    "strSearchString":searchString
  }
       return this.http.post(this.gomoenv.API_url+"MessagerConversationCount",body,options).
       map((res:Response)=>res.json());
  }

  BroadcastMessageInformation(searchString)
  {
    let options=new RequestOptions({headers:this.gomoenv.headers});
  let body={
    "strSearchString":searchString
  }
       return this.http.post(this.gomoenv.API_url+"BrodcastMessageInformation/",body,options).
       map((res:Response)=>res.json());
  }

  AcknowledgeBroadCast(searchString)
  {
    let options=new RequestOptions({headers:this.gomoenv.headers});
  let body={
    "strSearchString":searchString
  }
       return this.http.post(this.gomoenv.API_url+"AckBroadcastMessage/",body,options).
       map((res:Response)=>res.json());
  }
 //Remove Tags
 removeTags(tgdata){
  console.log(tgdata);
   let options=new RequestOptions({headers:this.gomoenv.headers});
   let body={ "commTagId" : tgdata.tagId }
   return  this.http.post(this.gomoenv.API_url+"RemoveCommTags",body,options).map((res:Response)=>res)
}

ReadConversationInfo(searchString)
   {
    let options=new RequestOptions({headers:this.gomoenv.headers});
    let body={ "strSearchString":searchString }
     return  this.http.post(this.gomoenv.API_url+"/ReadConversationInfo",body,options)
                         .map((res:Response)=>res.json())

   }
   
}//end for page

