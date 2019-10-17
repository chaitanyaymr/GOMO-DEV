import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, ToastController } from 'ionic-angular';
import {GomoEnvironment} from '../../common/gomoenvironmnet'
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GomoServiceProvider } from '../../providers/gomo-service/gomo-service';
import { GomodbServiceProvider } from '../../providers/gomodb-service/gomodb-service';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name:'signin'
})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  signupForm:FormGroup;
  keepmeloggedin:any={};
  isenabled:boolean=false;
  constructor(public navCtrl: NavController, public navParams: NavParams
    ,public gomoenv:GomoEnvironment,
    public gomoservice:GomoServiceProvider,
    private menu:MenuController,
   public gomodb:GomodbServiceProvider,
   private toastCtrl:ToastController
    ) {
      this.keepmeloggedin.selected=true;
      this.menu.enable(false);
  }

  ionViewDidLoad() {
  //this.gomoenv.CheckNetwork_Connection();
   // console.log('ionViewDidLoad LoginPage');
  }
  
  ngOnInit(){
    this.signupForm=new FormGroup({
      'username':new FormControl('',Validators.required),
      'password':new FormControl('',Validators.required),

    }); 
  }
  checklogin()
  {
     if(this.gomoenv.CheckNetwork_Connection()==true){
       this.isenabled=true;
    let remcheck =this.keepmeloggedin.selected==true?'Y':'N';
    if (!this.signupForm.controls["username"].valid)
    this.gomoenv.addErrorMessage("Enter User Name");
    if (!this.signupForm.controls["password"].valid)
    this.gomoenv.addErrorMessage("Enter Password");
    if(this.gomoenv.displayErrors()==true){
       
        this.userlogin(this.signupForm.controls["username"].value,
        this.signupForm.controls["password"].value,remcheck);
       }
      else
      {
      //this.gomoenv.showCredentialsAlert();
      this.isenabled=false;
      return false;
      }
  }
  }

  userlogin(uname,pwd,rem)
  {
     this.gomoenv.startLoading();
    this.gomoservice.gomouserlogin(uname,pwd, this.gomoenv.fcmtoken).subscribe
    ((data)=>{
     console.log(data);
        if(data.length>0)
        {
          let userinfo=data[0];
          if(userinfo.userErrorId==0)
          {
            let str="";
            str +="<deviceTokenInfo>"
            str +="<userId>"+userinfo.userId+"</userId>"
            str +="<deviceToken>"+this.gomoenv.fcmtoken+"</deviceToken>"
            str +="<deviceType>M</deviceType>"
            str +="</deviceTokenInfo>"

            this.gomoservice.CreateMemberUserDeviceToken(str).subscribe(res=>{
            
              console.log("Error_ID"+res[0].errId);
              console.log("Token FCM"+res[0].tokenKey);
             this.gomodb.createUser(userinfo.userId,userinfo.userImage,userinfo.userFName,userinfo.userLName,uname,pwd,userinfo.useGroupId,userinfo.userRole,
              userinfo.userToken,rem,userinfo.userMemberId,userinfo.userCheckInId,userinfo.userType,
              userinfo.userEmail).then((res)=>
              {
                this.gomoenv.username=userinfo.userFName+" "+userinfo.userLName;
                this.gomoenv.profileimg=this.gomoenv.imgurl+"/Membersusers/"+userinfo.userImage;
               //this.gomoenv.stopLoading();
                this.navCtrl.setRoot("1",{LoginID:userinfo.userId});
              });
              this.isenabled=false;
            })
          }
          else{
            this.gomoenv.stopLoading();
            this.gomoenv.showCredentialsAlert();
            this.isenabled=false;
            return false;
          }
        }
    });
  }
  ionViewWillLeave() {
    // enable the root left menu when leaving this page
     this.menu.enable(true);
  }
  noSpacePlz(instr){
    if(instr == 'uname'){
      var uname = this.signupForm.controls["username"].value;
      var index = uname.indexOf(' ');

      if(index > -1){
        this.presentToast();
        this.signupForm.controls["username"].patchValue(uname.trim());
      }

    }else if(instr == 'pwd'){
        var pwd = this.signupForm.controls["password"].value;
        var index = pwd.indexOf(' ');

      if(index > -1){
        this.presentToast();
        this.signupForm.controls["password"].patchValue(pwd.trim());
      }
    }
}


presentToast() {
// const toast = this.toastCtrl.create({
//   message: 'No spaces are allowed..!',
//   duration: 3000
// });
// toast.present();
this.gomoenv.showCredentialsAlert();
}
}
