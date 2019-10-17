import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the DocsDetailsPopUpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name:'docs-details-popup'
})
@Component({
  selector: 'page-docs-details-pop-up',
  templateUrl: 'docs-details-pop-up.html',
})
export class DocsDetailsPopUpPage {
  dataObj: any = {};
  tags: any = [];
  arr_versions:any=[];
  clr_private:string="";
  clr_public:string="";
  removePermission:boolean=false;
  newtag:string="";
  constructor(public navCtrl: NavController, public navParams: NavParams,private viewctrl:ViewController) {
    this.tags.push(
      {
        id: "facebook",
        name: "Facebook"
      },
      {
        id: "hvac",
        name: "HVAC"
      },
      {
        id: "ac",
        name: "Ac Systems"
      },
      {
        id: "Carrier",
        name: "Carrier"
      },
    );
    this.dataObj = {
      title: "PurchaseOrder-02",
      ext:"pdf",
      uploadedBy: "Jason Nichol",
      uploadedTs: "04.24.19 4:35:37",
      project: "Amazon Austin",
      documentCategory: "Purchase Order",
      versions_no: 14,
      view_permissions: "Public",
      editingPermissions_name: "Kevin Murphy",
      editingPermissions_desg: "Project Manager",
      editingPermissions_img:"assets\\icon\\DeafaultUserImg.png"
      
    }
   // this.arr_versions=Array(this.dataObj.versions_no).fill(1).map((x,i)=>i);
   for(let i=1;i<=this.dataObj.versions_no;i++)
      {
        this.arr_versions.push(i);
      }
    if(this.dataObj.view_permissions=="Public")
    {
      this.clr_private="grey";
      this.clr_public="dodgerblue";
    }
    else{
     this.clr_private="dodgerblue";
     this.clr_public="grey";
    }
    
  }

 changeProject(value)
 {
   console.log("Project Data",value);
 }
 changeDocumentCategory(value)
 {
   console.log("Document Category",value)
 }
  changeRemovePermission(event)
  {
     console.log("remove",event.target.checked)
  }
  hideModal(event)
  {   
      let data={
        flag:'',
        id:0,
        options:''
      }
  
    if(event.clientY > 0 && event.clientX > 260){    
      this.viewctrl.dismiss({'obj':data});
    }else if(event.clientX > 0 && event.clientY < 40){
      this.viewctrl.dismiss({'obj':data});
    }
  }
}
