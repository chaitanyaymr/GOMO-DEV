import { Component, ViewChild,Renderer,OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { GomoServiceProvider } from '../../providers/gomo-service/gomo-service';

/**
 * Generated class for the RemainderAccordionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name:'remainder-accordion'
})
@Component({
  selector: 'page-remainder-accordion',
  templateUrl: 'remainder-accordion.html',
})
export class RemainderAccordionPage {

  accordionExpanded_prj:boolean=false;
  accordionExpanded_vendor:boolean=false;
  accordionExpanded_task:boolean=false;
  accordionExpanded_personal:boolean=false;
  accordionExpanded_tag:boolean=false;

  @ViewChild('ccPrj') cardContent_prj:any;
  @ViewChild('ccVendor') cardContent_vendor:any;
  @ViewChild('ccTask') cardContent_task:any;
  @ViewChild('ccPersonal') cardContent_personal:any;
  @ViewChild('ccTag') cardContent_tag:any;

  prj:any=[];
  vendor:any=[];
  task:any=[];
  personal:any=[];
  tag:any=[];

  searchPrj:string="";
  searchVendor:string="";
  searchTask:string="";
  searchPersonal:string="";
  searchTag:string="";


  constructor(public navCtrl: NavController, public navParams: NavParams,public renderer:Renderer,private gomoservice:GomoServiceProvider,private viewctrl:ViewController) {
   this.prj=[];
   this.vendor=[];
   this.task=[];
   this.personal=[];
   this.tag=[];
  }

  ngOnInit()
  {
    this.renderer.setElementStyle(this.cardContent_prj.nativeElement,"webkitTransition","max-height 500ms, padding 500ms");
    this.renderer.setElementStyle(this.cardContent_vendor.nativeElement,"webkitTransition","max-height 500ms, padding 500ms");
    this.renderer.setElementStyle(this.cardContent_task.nativeElement,"webkitTransition","max-height 500ms, padding 500ms");
    this.renderer.setElementStyle(this.cardContent_personal.nativeElement,"webkitTransition","max-height 500ms, padding 500ms");
    this.renderer.setElementStyle(this.cardContent_tag.nativeElement,"webkitTransition","max-height 500ms, padding 500ms");

  }
  toggleAccordion(flag)
  {
      this.searchPrj="";
      this.searchPersonal="";
      this.searchVendor="";
      this.searchTask="";
      this.searchTag="";

      if(flag=="prj")
      {
        if(this.accordionExpanded_prj)
        {
          this.renderer.setElementStyle(this.cardContent_prj.nativeElement,"max-height","0px");
          this.renderer.setElementStyle(this.cardContent_prj.nativeElement,"padding","0px 16px");
          this.renderer.setElementStyle(this.cardContent_personal.nativeElement,"max-height","0px");
          this.renderer.setElementStyle(this.cardContent_personal.nativeElement,"padding","0px 16px");
          this.renderer.setElementStyle(this.cardContent_vendor.nativeElement,"max-height","0px");
          this.renderer.setElementStyle(this.cardContent_vendor.nativeElement,"padding","0px 16px");
          this.renderer.setElementStyle(this.cardContent_task.nativeElement,"max-height","0px");
          this.renderer.setElementStyle(this.cardContent_task.nativeElement,"padding","0px 16px");
          this.renderer.setElementStyle(this.cardContent_tag.nativeElement,"max-height","0px");
          this.renderer.setElementStyle(this.cardContent_tag.nativeElement,"padding","0px 16px");
        }
        else{
          this.renderer.setElementStyle(this.cardContent_personal.nativeElement,"max-height","0px");
          this.renderer.setElementStyle(this.cardContent_personal.nativeElement,"padding","0px 16px");
          this.renderer.setElementStyle(this.cardContent_vendor.nativeElement,"max-height","0px");
          this.renderer.setElementStyle(this.cardContent_vendor.nativeElement,"padding","0px 16px");
          this.renderer.setElementStyle(this.cardContent_task.nativeElement,"max-height","0px");
          this.renderer.setElementStyle(this.cardContent_task.nativeElement,"padding","0px 16px");
          this.renderer.setElementStyle(this.cardContent_tag.nativeElement,"max-height","0px");
          this.renderer.setElementStyle(this.cardContent_tag.nativeElement,"padding","0px 16px");
        }
        this.accordionExpanded_prj=!this.accordionExpanded_prj;
        this.accordionExpanded_personal=false;
        this.accordionExpanded_vendor=false;
        this.accordionExpanded_task=false;
        this.accordionExpanded_tag=false;
    }//end for project
    else if(flag=="personal")
    {
       if(this.accordionExpanded_personal)
       {
        this.renderer.setElementStyle(this.cardContent_prj.nativeElement,"max-height","0px");
        this.renderer.setElementStyle(this.cardContent_prj.nativeElement,"padding","0px 16px");
        this.renderer.setElementStyle(this.cardContent_personal.nativeElement,"max-height","0px");
        this.renderer.setElementStyle(this.cardContent_personal.nativeElement,"padding","0px 16px");
        this.renderer.setElementStyle(this.cardContent_vendor.nativeElement,"max-height","0px");
        this.renderer.setElementStyle(this.cardContent_vendor.nativeElement,"padding","0px 16px");
        this.renderer.setElementStyle(this.cardContent_task.nativeElement,"max-height","0px");
        this.renderer.setElementStyle(this.cardContent_task.nativeElement,"padding","0px 16px");
        this.renderer.setElementStyle(this.cardContent_tag.nativeElement,"max-height","0px");
        this.renderer.setElementStyle(this.cardContent_tag.nativeElement,"padding","0px 16px");
       }
       else{
        this.renderer.setElementStyle(this.cardContent_prj.nativeElement,"max-height","0px");
        this.renderer.setElementStyle(this.cardContent_prj.nativeElement,"padding","0px 16px");
        this.renderer.setElementStyle(this.cardContent_vendor.nativeElement,"max-height","0px");
        this.renderer.setElementStyle(this.cardContent_vendor.nativeElement,"padding","0px 16px");
        this.renderer.setElementStyle(this.cardContent_task.nativeElement,"max-height","0px");
        this.renderer.setElementStyle(this.cardContent_task.nativeElement,"padding","0px 16px");
        this.renderer.setElementStyle(this.cardContent_tag.nativeElement,"max-height","0px");
        this.renderer.setElementStyle(this.cardContent_tag.nativeElement,"padding","0px 16px");
       }
       this.accordionExpanded_prj=false;
       this.accordionExpanded_personal=!this.accordionExpanded_personal;
       this.accordionExpanded_vendor=false;
       this.accordionExpanded_task=false;
       this.accordionExpanded_tag=false;
    }//end for personal
     
    else if(flag=="vendor")
    {
      if(this.accordionExpanded_vendor)
      {
        this.renderer.setElementStyle(this.cardContent_prj.nativeElement,"max-height","0px");
        this.renderer.setElementStyle(this.cardContent_prj.nativeElement,"padding","0px 16px");
        this.renderer.setElementStyle(this.cardContent_personal.nativeElement,"max-height","0px");
        this.renderer.setElementStyle(this.cardContent_personal.nativeElement,"padding","0px 16px");
        this.renderer.setElementStyle(this.cardContent_vendor.nativeElement,"max-height","0px");
        this.renderer.setElementStyle(this.cardContent_vendor.nativeElement,"padding","0px 16px");
        this.renderer.setElementStyle(this.cardContent_task.nativeElement,"max-height","0px");
        this.renderer.setElementStyle(this.cardContent_task.nativeElement,"padding","0px 16px");
        this.renderer.setElementStyle(this.cardContent_tag.nativeElement,"max-height","0px");
        this.renderer.setElementStyle(this.cardContent_tag.nativeElement,"padding","0px 16px");
      }
      else{
        this.renderer.setElementStyle(this.cardContent_prj.nativeElement,"max-height","0px");
        this.renderer.setElementStyle(this.cardContent_prj.nativeElement,"padding","0px 16px");
        this.renderer.setElementStyle(this.cardContent_personal.nativeElement,"max-height","0px");
        this.renderer.setElementStyle(this.cardContent_personal.nativeElement,"padding","0px 16px");
        this.renderer.setElementStyle(this.cardContent_task.nativeElement,"max-height","0px");
        this.renderer.setElementStyle(this.cardContent_task.nativeElement,"padding","0px 16px");
        this.renderer.setElementStyle(this.cardContent_tag.nativeElement,"max-height","0px");
        this.renderer.setElementStyle(this.cardContent_tag.nativeElement,"padding","0px 16px");
      }
      this.accordionExpanded_prj=false;
      this.accordionExpanded_personal=false;
      this.accordionExpanded_vendor=!this.accordionExpanded_vendor;
      this.accordionExpanded_task=false;
      this.accordionExpanded_tag=false;
    }// end for vendor
   else if(flag=="task")
   {
     if(this.accordionExpanded_task)
     {
      this.renderer.setElementStyle(this.cardContent_prj.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_prj.nativeElement,"padding","0px 16px");
      this.renderer.setElementStyle(this.cardContent_personal.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_personal.nativeElement,"padding","0px 16px");
      this.renderer.setElementStyle(this.cardContent_vendor.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_vendor.nativeElement,"padding","0px 16px");
      this.renderer.setElementStyle(this.cardContent_task.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_task.nativeElement,"padding","0px 16px");
      this.renderer.setElementStyle(this.cardContent_tag.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_tag.nativeElement,"padding","0px 16px");
     }
     else{
      this.renderer.setElementStyle(this.cardContent_prj.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_prj.nativeElement,"padding","0px 16px");
      this.renderer.setElementStyle(this.cardContent_personal.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_personal.nativeElement,"padding","0px 16px");
      this.renderer.setElementStyle(this.cardContent_vendor.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_vendor.nativeElement,"padding","0px 16px");
      this.renderer.setElementStyle(this.cardContent_tag.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_tag.nativeElement,"padding","0px 16px");
     }
     this.accordionExpanded_prj=false;
     this.accordionExpanded_personal=false;
     this.accordionExpanded_vendor=false;
     this.accordionExpanded_task=!this.accordionExpanded_task;
     this.accordionExpanded_tag=false;
   }//end for task
 
   else if(flag=="tag")
   {
     if(this.accordionExpanded_tag)
     {
      this.renderer.setElementStyle(this.cardContent_prj.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_prj.nativeElement,"padding","0px 16px");
      this.renderer.setElementStyle(this.cardContent_personal.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_personal.nativeElement,"padding","0px 16px");
      this.renderer.setElementStyle(this.cardContent_vendor.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_vendor.nativeElement,"padding","0px 16px");
      this.renderer.setElementStyle(this.cardContent_task.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_task.nativeElement,"padding","0px 16px");
      this.renderer.setElementStyle(this.cardContent_tag.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_tag.nativeElement,"padding","0px 16px");
     }
     else{
      this.renderer.setElementStyle(this.cardContent_prj.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_prj.nativeElement,"padding","0px 16px");
      this.renderer.setElementStyle(this.cardContent_personal.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_personal.nativeElement,"padding","0px 16px");
      this.renderer.setElementStyle(this.cardContent_vendor.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_vendor.nativeElement,"padding","0px 16px");
      this.renderer.setElementStyle(this.cardContent_task.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_task.nativeElement,"padding","0px 16px");
     }
     this.accordionExpanded_prj=false;
     this.accordionExpanded_personal=false;
     this.accordionExpanded_vendor=false;
     this.accordionExpanded_task=false;
     this.accordionExpanded_tag=!this.accordionExpanded_tag;
   }//end for tag


  }//end for toggle
  search(flag:any,obj:any)
  {
    
  }

  closeModal()
  {
    this.viewctrl.dismiss();
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
