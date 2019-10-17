import { GomoEnvironment } from './../../common/gomoenvironmnet';
import { Http,RequestOptions,Response,Headers } from '@angular/http';
import { Injectable,EventEmitter } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { GomodbServiceProvider } from '../gomodb-service/gomodb-service';
/*
  Generated class for the SignalRServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SignalRServiceProvider {

  signalrurl:string="https://devwfm.usegomo.com/";
  public connection: any;
  public connectionEstablished: EventEmitter<Boolean>;
  public connectionExists: boolean;
  public messageReceived: EventEmitter<any>;
  public typing:EventEmitter<any>;
  userinfo:any=[];
  loggedinUserId:any="";

  constructor(public http: Http,public gomoenv:GomoEnvironment,private db:GomodbServiceProvider) {

    this.db.getAllUsers().then(data=>{
      let userinfo=data;
     this.loggedinUserId=userinfo[0].UserId;           
  })

   this.signalrurl="https://devwfm.usegomo.com/";
   this.connectionEstablished = new EventEmitter<Boolean>();
   this.connectionExists = false;
   this.messageReceived=new EventEmitter<any>();
   this.typing=new EventEmitter<any>();

   this.createConnection();


   this.registerOnServerEvents();
   this.startConnection();
  //  this.connection.onDisconnected().then(()=>{
  //    this.startConnection();
  //  })
 
 
     this.connection.onclose( async()=>{
      console.log("Connection state",this.connection.state)
      await this.start();
     })
    
 
  }
  private createConnection() {  
    // this._hubConnection = new HubConnectionBuilder().withUrl(`${url}${configdata}`).build();
    let configdata='?connect='+this.loggedinUserId;
    console.log('login id'+this.loggedinUserId);
    let url="https://devwfm.usegomo.com/notify"

    this.connection = new HubConnectionBuilder()  
      //.withUrl(`${url}${configdata}`)
      .withUrl(this.signalrurl+"notify")
      .build();  
  } 

  async  start() {
    try {
        await this.startConnection();
        console.log("connected");
    } catch (err) {
        console.log(err);
       
    }
}



  private startConnection(): void {
    
    this.connection
    .start()
    .then(()=>{
      console.log("Now connected " ,this.connection.state);
      console.log("connection",this.connection);
                  this.connectionEstablished.emit(true);
                  console.log(this.connection.ID);
          this.connectionExists = true;
      
         this.connection.invoke('connect',this.loggedinUserId).then(()=>console.log("Connected to user")).catch(err=>console.log("Error at connect to user",err));
         this.connection.invoke('getConnectionId').then((id)=>{console.log("Connected id:"+id);this.gomoenv.signalrConnectionId=id;}).catch(err=>console.log("Error at connectid",err));
    })
    .catch((err)=>
    {
      console.log("Error at siganlr connection",err)
      setTimeout(() => this.start(), 5000);
    });
      // .start({ jsonp: true })
      // .done((data: any) => {
      //   console.log(
      //     "Now connected " + data.transport.name + ", connection ID= " + data.id
      //   );
      //   localStorage.setItem("connectionid", data.id);        
      //   this.connectionEstablished.emit(true);
      //   this.connectionExists = true;
      // })
      // .fail((error: any) => {
      //   console.log("Could not connect " + error);
      //   this.connectionEstablished.emit(false);
      // });
  }
 
  private registerOnServerEvents():void
  {
    this.connection.on('BroadcastMessage', (type: string, payload: string) => {
       console.log("from signalr",payload);
       this.messageReceived.emit({convinfo:payload});
    });

    this.connection.on('BroadcastTyping',(type: string, typingStatus: string, groupId: string)=>{
      console.log("from signalr::Type:",type,";;TypingStatus:",typingStatus,";;groupId:",groupId);
      this.typing.emit({type:type,typingStatus:typingStatus,groupId:groupId})
    });
  }
  sendMessage_signalR(strstring)
  {
    let options=new RequestOptions({headers:this.gomoenv.headers});
    let body={
         "convoInfo":strstring
        }
           
        return  this.http.post(this.signalrurl+"api/User",body,options)
                         .map((res:Response)=>res.json())
  }

   sendTyping_signalR(convinfo,grpid,msgStatus,userid,msgType)
   {
    let options=new RequestOptions({headers:this.gomoenv.headers});
    let body={
         "convoInfo":convinfo,
         "groupId": grpid,
         "msgStatus":msgStatus,
         "msgType": msgType,
         "userId": userid
        }
           
        return  this.http.post(this.signalrurl+"api/GetType",body,options)
                         .map((res:Response)=>res);
   }

}
