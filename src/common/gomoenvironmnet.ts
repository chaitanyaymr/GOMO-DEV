import{Injectable,OnInit } from '@angular/core'
import { AlertController, LoadingController, ToastController } from 'ionic-angular';
declare var navigator:any;
@Injectable()
export class GomoEnvironment implements OnInit{
    public loadingPopup: any;
    public API_url :any;
    public imgurl:any;
    public n_errorcount :any=0;
    public v_message :any='';
    public headers:any;
    public ApiUrl:any;
    fcmtoken:any="";
    public Chat_count:Number=0;
    public pageid : any=0;
    public signalrConnectionId:any="";
    public username:any="";
    public profileimg:any="";
    public globleconvid:any="";
    public ismsgsend:boolean=false;
    public isdeleteorclear:any="";
    public isall_convlist:boolean=false;
    public isTyping:boolean=false;
    public isMute_global:boolean=false;
    constructor
        ( public alertController: AlertController,
        public loadingCtrl: LoadingController,
        public toastController: ToastController,
        public alertCtrl: AlertController
        )
    {
        this.API_url='https://devapi.usegomo.com/api/'
       
         this.imgurl='https://devapi.usegomo.com/Images/'
    }
    ngOnInit(){
 
    }
   
addErrorMessage(msg) {
    this.n_errorcount = this.n_errorcount + 1;
    this.v_message =
      this.v_message + "(" + this.n_errorcount + ") " + msg + "<br/>";
  }

  displayErrors() {
    if (this.n_errorcount == 0) {
      return true;
    } else {
      let alert = this.alertController.create();
      alert.setTitle("Please check the following: <p>" + this.v_message+"</p>");
      alert.addButton({
        text: "OK"
      });
      alert.present();
      this.v_message = "";
      this.n_errorcount = 0;
      return false;
    }
  }

  showCredentialsAlert() {
    let alert = this.alertController.create({
      title: "",
      subTitle: "Invalid User Name or Password",
      buttons: ["OK"],
      cssClass:'alertcss'
    });
    alert.present();
  }
  
   startLoading()
   {
     this.loadingPopup=this.loadingCtrl.create({
       enableBackdropDismiss:true,
       content:`<div class="loading-Header" ></div>
       <div class="custom-spinner-container">
       <div class="custom-spinner-box">
       <div class="loading-body"> Loading ... </div>
       </div>
     </div>`,
     duration:5000
     });
     this.loadingPopup.present();
   }
   startLoading3()
   {
     this.loadingPopup=this.loadingCtrl.create({
       enableBackdropDismiss:true,
       content:`<div class="loading-Header" ></div>
       <div class="custom-spinner-container">
       <div class="custom-spinner-box">
       <div class="loading-body"> Loading ... </div>
       </div>
     </div>`,
     duration:3000
     });
     this.loadingPopup.present();
   }
   startdownLoading(){
    this.loadingPopup=this.loadingCtrl.create({
      enableBackdropDismiss:true,
      content:`<div class="loading-Header" ></div>
      <div class="custom-spinner-container">
      <div class="custom-spinner-box">
      <div class="loading-body"> Downloading ... </div>
      </div>
    </div>`,
     duration:3000
    });
    this.loadingPopup.present();
   }

   convstartLoading()
   {
     this.loadingPopup=this.loadingCtrl.create({
       enableBackdropDismiss:true,
       content:`<div class="loading-Header" ></div>
       <div class="custom-spinner-container">
       <div class="custom-spinner-box">
       <div class="loading-body"> Loading ... </div>
       </div>
     </div>`,
     });
     this.loadingPopup.present();
   }
   archdelstartLoading()
   {
     this.loadingPopup=this.loadingCtrl.create({
       enableBackdropDismiss:true,
       content:`<div class="loading-Header" ></div>
       <div class="custom-spinner-container">
       <div class="custom-spinner-box">
       <div class="loading-body"> Loading ... </div>
       </div>
     </div>`,
     duration:3000
     });
     this.loadingPopup.present();
   }

   stopLoading()
   {
      setTimeout(()=>{
        this.loadingPopup.dismiss();
        return false;
      },500);
   }

 ShowAlert(message){
    let alert = this.alertController.create();
      alert.setTitle(message);
      alert.addButton({
        text: "OK"
      });
      alert.present();
      this.v_message = "";
      this.n_errorcount = 0;
  }

  public CheckNetwork_Connection():boolean {
    
    var networkState = navigator.connection.type;
    if (networkState == "none") {
      this.toastController.create({
        message: `You are now offline`,
        duration: 3000
      }).present();
        
        return false;
    }
    else {
        return true;
    }

}

}