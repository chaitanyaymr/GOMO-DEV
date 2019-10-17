import { GomoEnvironment } from './../../common/gomoenvironmnet';
import { FileEntry } from '@ionic-native/file';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { GomodbServiceProvider } from './../../providers/gomodb-service/gomodb-service';
import { GomoServiceProvider } from '../../providers/gomo-service/gomo-service';


/**
 * Generated class for the UserprofilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name:'profilepage'
})
@Component({
  selector: 'page-userprofile',
  templateUrl: 'userprofile.html',
})
export class UserprofilePage {

  userid:number;
  fname:string;
  lname:string;
  email:string;
  phno:any;
  uimg : any;

  imageURI: string;
  item: any = [{}]; 
  imgs:any=[];
  public base64Image: string;
  cameraData: string;
  photoTaken: boolean = false;
  cameraUrl: string;
  photoSelected: boolean;
  loggedinUserid:any="";
   defaultimage:string="assets/imgs/nouser.png"
  mask: any[] =['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  constructor(public navCtrl: NavController, public navParams: NavParams , public alertCtrl:AlertController, 
    private camera: Camera , private db:GomodbServiceProvider , private messengerservice : GomoServiceProvider,
    private gomoenv:GomoEnvironment,private modal:ModalController) {
    //this.loggedinUserid=this.navParams.get("loginid");
    this.db.getAllUsers().then((data:any)=>{
      let user:any="";
      user=data;
      this.loggedinUserid=user[0].UserId;
      this.getprofiledetails();
    })
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserprofilePage');
  }

   getprofiledetails()
   {
    // this.db.getAllUsers().then(data=>{
      
    //   this.userid=data[0].UserId;
    //   this.fname=data[0].userFName;
    //   this.lname = data[0].userLName; 
    //   this.email = data[0].userMailId;    
    //   this.uimg="https://devapi.usegomo.com/Images/Membersusers/"+data[0].UserImage;     
    // });
    let str="<userInfo>";
    str+="<loggedInUserId>"+this.loggedinUserid+"</loggedInUserId>";
    str+="</userInfo>";
    this.messengerservice.GetUserProfileData(str).subscribe(data=>{
        this.userid=data[0].id;
      this.fname=data[0].fName;
      this.lname = data[0].lName; 
      this.email = data[0].email;    
      this.uimg="https://devapi.usegomo.com/Images/Membersusers/"+data[0].image;    
      this.phno=data[0].phone

    })
   }
   formatphonenumber(number) {
    if (!(/^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$/).test(number)) return true;    
    
    return false;
}
formatPh(event)
{
  console.log("ev",event.value);
  let phone:any=event.value;
  let p=phone;
  let pp="",c,d,r,s,e;
  if(phone.length>0)
  {
    if(phone.length<=3)
    {
       pp="";
       for (c = 0, d = phone.length; c < d ; c += 1) 
       {
        if (isNaN(phone.charAt(c)) || phone.charAt(c) == ' ')
           continue;
         else
        pp = pp + phone.charAt(c);
      }
       p = pp;
    }
    else if(phone.length>3)
    {
      let pAry=phone.split('-');
      phone="";
      for (r = 0, s = pAry.length; r < s ; r += 1)
      if (pAry[r])
          phone += pAry[r];
      pp="";
      for (c = 0, e = phone.length; c < e ; c += 1) {
        if (isNaN(phone.charAt(c)) || phone.charAt(c) == ' ')
            continue;
        else
            pp = pp + phone.charAt(c);
    }
    if (pp.length >= 10)
                pp = pp.substring(0, 3) + '-' + pp.substring(3, 6) + '-' + pp.substring(6, 10);
            else if (pp.length > 6)
                pp = pp.substring(0, 3) + '-' + pp.substring(3, 6) + '-' + pp.substring(6,10);
            else
                pp = pp.substring(0, 3) + '-' + pp.substring(3, 6);
            p = pp;
    }
  }
  if (p == '-') p = '';
   this.phno=p;  
}


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
    
  let indexOfLash = imageData.lastIndexOf('/') + 1;
  let name = imageData.substr(indexOfLash);
  let namePath = imageData.substr(0, indexOfLash);
 console.log("name:",name,":namepath",namePath);
   let response:any = await  new Promise((resolve, reject)=>{  
    let fileUrl = imageData;            
    window['resolveLocalFileSystemURL'](fileUrl,(FileEntry:any) => {
      console.log(FileEntry);
      FileEntry.file((File) => {
        console.log(File);
        let reader = new FileReader();
        reader.onloadend = (evt: any) => {
          this.uimg=FileEntry.nativeURL;
          let imgBlob: any = new Blob([new Uint8Array(evt.target.result)],{type:'image/png'});
          imgBlob.name = File.name;
         
          this.imgs.push(imgBlob);
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

  this.photoTaken = true;
        this.photoSelected = false;
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
      correctOrientation:true
    }).then( async imageData => {
      let indexOfLash = imageData.lastIndexOf('/') + 1;
  let name = imageData.substr(indexOfLash);
  let namePath = imageData.substr(0, indexOfLash);
 
   console.log("name:",name,":namepath",namePath);
   let response:any = await  new Promise((resolve, reject)=>{  
    let fileUrl = imageData;            
    window['resolveLocalFileSystemURL'](fileUrl,(FileEntry:any) => {
      console.log(FileEntry);
      FileEntry.file((File) => {
        console.log(File);
        let reader = new FileReader();
        reader.onloadend = (evt: any) => {
          this.uimg=FileEntry.nativeURL;
          let imgBlob: any = new Blob([new Uint8Array(evt.target.result)],{type:'image/png'});
          imgBlob.name = File.name;
        
          this.imgs.push(imgBlob);
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
  this.photoTaken = true;
  this.photoSelected = false;
 
    }, error => {
      console.log("ERROR -> " + JSON.stringify(error));
    });
  }



  showAlertpopup() {
    let alert = this.alertCtrl.create({
      title: 'Add Photo!',
      buttons: [
        { text: 'Take Photo', handler: () => this.takepicture() },
        { text: 'Choose From Gallery', handler: () => this.selectFromGallery() },
        { text: 'Cancel', role: 'cancel' }
      ]

    });
    alert.present();
  }

  cancelprofile()
  {
    this.navCtrl.pop();
  }
checkBeforeSave()
{
  if(this.fname=="")
  this.gomoenv.addErrorMessage("Enter First name");
if(this.lname=="")
  this.gomoenv.addErrorMessage("Enter Last name");
if(this.email=="")
  this.gomoenv.addErrorMessage("Enter E-mail");
if(this.phno=="")
  this.gomoenv.addErrorMessage("Enter Phone");
  return this.gomoenv.displayErrors();
}
   saveprofile()
   {
     
     let r=this.checkBeforeSave()
     if(r==false)
      return false;
      else{

     
    let formData=new FormData();
     if(this.imgs.length>0)
        formData.append("uploadFile_0",this.imgs[0],this.imgs[0].name);
    let profiledata = JSON.stringify({"MemberUserId" : this.userid, "FirstName": this.fname, "LastName" : this.lname,"Email" : this.email , "Phone" :this.phno});
      formData.append('xml',profiledata);
       
        this.messengerservice.saveprofiledata(formData).subscribe(response =>{
        console.log("response after uploading",response);
        let str="<userInfo>";
        str+="<loggedInUserId>"+this.loggedinUserid+"</loggedInUserId>";
        str+="</userInfo>";
        this.messengerservice.GetUserProfileData(str).subscribe(data=>{
            this.userid=data[0].id;
          this.fname=data[0].fName;
          this.lname = data[0].lName; 
          this.email = data[0].email;    
          this.uimg=data[0].image;    
          this.phno=data[0].phone
          this.db.updateUser(this.userid,this.fname,this.lname,this.email,this.phno,data[0].image).then(data=>{
            console.log("db updated",data);
            this.gomoenv.profileimg=this.gomoenv.imgurl+"/Membersusers/"+this.uimg;
            this.gomoenv.username=this.fname+' '+this.lname;
            this.imgs=[];
            this.navCtrl.pop();
          })
        })
        
        });

  }
   }
   
openDocsModal()
{
  // let mdl=this.modal.create("docs-accordion");
  //let mdl=this.modal.create("remainder-accordion");
  let mdl=this.modal.create("docs-details-popup");
  mdl.present();
}

}
