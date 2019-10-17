import { Component} from '@angular/core';
import { Platform, App, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FCM } from '@ionic-native/fcm';
import { Network } from '@ionic-native/network';
import { GomoEnvironment } from '../common/gomoenvironmnet';
import { GomodbServiceProvider } from '../providers/gomodb-service/gomodb-service';
import { NativeStorage } from '@ionic-native/native-storage';
import { LocalNotifications } from '@ionic-native/local-notifications';
@Component({
  templateUrl: 'app.html'
})
export class Gomo_tm {
 
  rootPage:any = '';

  pages:Array<{title:string,component:any,name:string}>
  user:any=[];
  defaultimage:string="assets/imgs/nouser.png"
 
  constructor(public platform: Platform, public statusBar: StatusBar, 
    public splashScreen: SplashScreen,public app:App,public fcm:FCM,private network:Network,
    private toast:ToastController,
    public gomenv:GomoEnvironment,
    public gomodb:GomodbServiceProvider,
    private storage:NativeStorage ,
    private localNotifications: LocalNotifications 
    ) {
  
     
      platform.ready().then(() => {
      
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      

      statusBar.styleDefault();
      statusBar.backgroundColorByHexString("#053a76");
      splashScreen.hide();

      platform.resume.subscribe((result)=>{//Foreground
        this.localNotifications.clearAll().then(resp => {
          console.log("Clear All Notifications :" + resp);
        });
        this.gomenv.isTyping=false;
      });


      fcm.subscribeToTopic('all');
    
      fcm.getToken().then((token)=>{
        console.log('get token '+token)
        gomenv.fcmtoken=token;
     })
  
     fcm.onNotification().subscribe((data)=>{
      if(data.wasTapped)
      {
        console.log("received Notification",data);
       
       
      this.localNotifications.clearAll().then(resp => {
        console.log("Clear All Notifications :" + resp);
      });
       
        // if(data.type=="Mobile")
        // {
        
        //   let result=JSON.parse(data.info);
        //   let resp={};
        //   resp={
        //     'convoId':result.convoId,'groupId':result.groupId,
        //   'projectId':0,'userId':result.msgFromId,
        //   'convoName':result.convoName,'convoImage':result.convoImage,
        //   'convoRole':result.logStatus, 'convtype':result.groupType,
        //    'loginid':result.loginid};
        //    console.log("object notification",resp)
        //    this.app.getActiveNav().push('2',{convobj:resp});
        // }
        this.gomodb.getAllUsers().then((data:any)=>{
       
          //sconsole.log("userData",this.user);
          if(data.length>0)
          {
        this.app.getActiveNav().setRoot("1",{LoginID:data[0].UserId});
          }
        });
      }
      else
      {
       
       console.log("received Notification foreground");
      }
    });
     fcm.onTokenRefresh().subscribe((token)=>{
      gomenv.fcmtoken=token;
      console.log(token);
  });

   
        this.gomodb.getDatabaseState().subscribe((result)=>{
          console.log("Database State",result);
             if(result)
              {
                this.gomodb.getAllUsers().then((data:any)=>{
                  this.user=data;
                  console.log("userData",this.user);
                  if(this.user.length>0)
                  {
                    if(this.user[0].Rem=="Y")
                    {//this.rootPage='1';
                    this.localNotifications.clearAll().then(resp => {
                      console.log("Clear All Notifications :" + resp);
                    });
                     
                    this.gomenv.username=this.user[0].userFName+" "+this.user[0].userLName;
                    this.gomenv.profileimg="https://devapi.usegomo.com/Images/Membersusers/"+this.user[0].UserImage
                    this.gomenv.startLoading();
                    this.app.getActiveNav().setRoot("1",{LoginID:this.user[0].UserId});
                  }
                  else{
                    this.rootPage='signin';
                    this.app.getActiveNav().setRoot("signin");
                 }
                }
                  else{
                         this.rootPage='signin';
                         this.app.getActiveNav().setRoot("signin");
                      }
                })
                }
      
               });
      
    });

    this.pages=[
        {title:"Home",component:"1",name:"Home" },
        {title:"Profile",component:"profilepage",name:"MyConvs"}
    ];


  //   let connct= this.network.onConnect().subscribe((data) => {
  //     this.displayNetworkUpdate(data.type);
  //  });
  
  let disconnt= this.network.onDisconnect().subscribe((data) => {
      this.displayNetworkUpdate(data.type);
   });
  }

  Logout()
  {
    this.gomodb.deleteUser().then((data)=>
    {
       this.user.Name="";
       this.app.getActiveNav().setRoot("signin");
    }
   
   ),(error)=>{console.log("Error while truncating",error)}     
  }

  openPage(page) {
    if(page.component=="1"){
    this.gomenv.startLoading();
    this.app.getActiveNav().setRoot("1",{LoginID:this.user[0].UserId})
    }
  else
     this.app.getActiveNav().push(page.component);
  }

  displayNetworkUpdate(connectionState: string){
    let networkType = (this.network.type=="none")?"":"via "+this.network.type;
    // if(this.network.type.toLowerCase()=="wifi")
    // {
    //   this.networkinteface.getWiFiIPAddress().then((data:any)=>{
    //      this.db.ipAddress=data.ip;
    //   }).catch(err=>{
    //     console.log("Error at wifi ip",err)
    //     this.db.ipAddress="";
    //   })
    // }
    // else{
    //   this.networkinteface.getCarrierIPAddress().then((data:any)=>{
    //      this.db.ipAddress=data.ip;
    //   }).catch(err=>{
    //     console.log("Error at carrier ip",err)
    //     this.db.ipAddress="";
    //   })
    // }
    this.toast.create({
      message: `You are now ${connectionState}`,
      duration: 3000
    }).present();
  }


  profile()
  {
    this.app.getActiveNav().push('profilepage');
  }



}
//plugins installed
/***************************************
 * ionic cordova plugin add cordova-plugin-filechooser
 * npm install @ionic-native/file-chooser@4.0.0
 * 
 * ionic cordova plugin add cordova-plugin-filepath
 * npm install @ionic-native/file-path@4.0.0
 * 
 * ionic cordova plugin add com-badrit-base64
 * npm install @ionic-native/base64@4.0.0
 * 
 * GOTO PATH 
 * E:\IonicExamples\FileChooser\App\platforms\android\app\src\main\java\com\hiddentao\cordova\filepath
 * open file FilePath.java and comment import android.support.v4.app.ActivityCompat;
 *
 * ionic cordova plugin add cordova-plugin-local-notification
 * npm install --save @ionic-native/local-notifications@4
 * 
 * 
 * 
 * 
 ************************************************/