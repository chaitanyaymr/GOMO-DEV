import { Component, ViewChild, Renderer, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { GomoServiceProvider } from '../../providers/gomo-service/gomo-service';

/**
 * Generated class for the HomeAccordionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name:'accordion'
})
@Component({
  selector: 'page-home-accordion',
  templateUrl: 'home-accordion.html',
})
export class HomeAccordionPage implements OnInit{

  accordionExpanded_people:boolean=false;
  accordionExpanded_group:boolean=false;
  accordionExpanded_prj:boolean=false;
  accordionExpanded_track:boolean=false;
  accordionExpanded_tags:boolean=false;

  @ViewChild('ccP') cardContent_people:any;
  @ViewChild('ccG') cardContent_group:any;
  @ViewChild('ccPrj') cardContent_prj:any;
  @ViewChild('ccTrack') cardContent_track:any;
  @ViewChild('ccTags') cardContent_tags:any;
  loggedinUserId:any=0;
  people:any=[];
  group:any=[];
  prj:any=[];
  track:any=[];
  tags:any=[];
  searchPeople:string="";
  searchGroup:string="";
  searchPrj:string="";
  searchTrack:string="";
  searchTags:string="";
  constructor(public navCtrl: NavController, public navParams: NavParams,public renderer:Renderer,private gomoservice:GomoServiceProvider,private viewctrl:ViewController) 
  {
    this.loggedinUserId=this.navParams.get("loginid");
  }

  ngOnInit()
  {
    this.renderer.setElementStyle(this.cardContent_people.nativeElement,"webkitTransition","max-height 500ms, padding 500ms");
    this.renderer.setElementStyle(this.cardContent_group.nativeElement,"webkitTransition","max-height 500ms, padding 500ms");
    this.renderer.setElementStyle(this.cardContent_prj.nativeElement,"webkitTransition","max-height 500ms, padding 500ms");
    this.renderer.setElementStyle(this.cardContent_track.nativeElement,"webkitTransition","max-height 500ms, padding 500ms");
    this.renderer.setElementStyle(this.cardContent_tags.nativeElement,"webkitTransition","max-height 500ms, padding 500ms");
  }

  toggleAccordion(flag)
   {
      this.searchGroup="";
      this.searchPeople="";
      this.searchPrj="";
      this.searchTrack="";
      this.searchTags="";
   if(flag=='p')
   {
     if(this.accordionExpanded_people)
     {
      this.renderer.setElementStyle(this.cardContent_people.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_people.nativeElement,"padding","0px 16px");
      this.renderer.setElementStyle(this.cardContent_group.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_group.nativeElement,"padding","0px 16px"); 
      this.renderer.setElementStyle(this.cardContent_prj.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_prj.nativeElement,"padding","0px 16px");   
      this.renderer.setElementStyle(this.cardContent_track.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_track.nativeElement,"padding","0px 16px");
      this.renderer.setElementStyle(this.cardContent_tags.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_tags.nativeElement,"padding","0px 16px");        
     }
     else{
      this.renderer.setElementStyle(this.cardContent_group.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_group.nativeElement,"padding","0px 16px"); 
      this.renderer.setElementStyle(this.cardContent_prj.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_prj.nativeElement,"padding","0px 16px"); 
      this.renderer.setElementStyle(this.cardContent_track.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_track.nativeElement,"padding","0px 16px"); 
      this.renderer.setElementStyle(this.cardContent_tags.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_tags.nativeElement,"padding","0px 16px");   
      let str="<searchInfo>";
      str+="<loggedInEmpId>"+this.loggedinUserId+"</loggedInEmpId>";
      str+="<searchType>CBU</searchType>";
      str+="</searchInfo>";
      this.gomoservice.Search_Accordion(str).subscribe(data=>{
        console.log("people data",data);
        this.people=[];
        this.people=data.sort(this.compareValues('formTitle'));
        this.renderer.setElementStyle(this.cardContent_people.nativeElement,"max-height","500px");
        this.renderer.setElementStyle(this.cardContent_people.nativeElement,"padding","13px 16px");
      });
     }
     this.accordionExpanded_group=false;
     this.accordionExpanded_prj=false;
     this.accordionExpanded_track=false;
     this.accordionExpanded_tags=false;
     this.accordionExpanded_people=!this.accordionExpanded_people;
   }//end for People
else if(flag=='g')
{
  if(this.accordionExpanded_group)
     {
      this.renderer.setElementStyle(this.cardContent_people.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_people.nativeElement,"padding","0px 16px");
      this.renderer.setElementStyle(this.cardContent_group.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_group.nativeElement,"padding","0px 16px");  
      this.renderer.setElementStyle(this.cardContent_prj.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_prj.nativeElement,"padding","0px 16px"); 
      this.renderer.setElementStyle(this.cardContent_track.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_track.nativeElement,"padding","0px 16px");    
      this.renderer.setElementStyle(this.cardContent_tags.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_tags.nativeElement,"padding","0px 16px");   
     }
    else{
      this.renderer.setElementStyle(this.cardContent_people.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_people.nativeElement,"padding","0px 16px"); 
      this.renderer.setElementStyle(this.cardContent_prj.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_prj.nativeElement,"padding","0px 16px"); 
      this.renderer.setElementStyle(this.cardContent_track.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_track.nativeElement,"padding","0px 16px"); 
      this.renderer.setElementStyle(this.cardContent_tags.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_tags.nativeElement,"padding","0px 16px");   
      let str="<searchInfo>";
      str+="<loggedInEmpId>"+this.loggedinUserId+"</loggedInEmpId>";
      str+="<searchType>CBG</searchType>";
      str+="</searchInfo>";
      this.gomoservice.Search_Accordion(str).subscribe(data=>{
        console.log("group data",data);
        this.group=[];
        this.group=data.sort(this.compareValues('formTitle'));;
        this.renderer.setElementStyle(this.cardContent_group.nativeElement,"max-height","500px");
        this.renderer.setElementStyle(this.cardContent_group.nativeElement,"padding","13px 16px");
      })
    }
    this.accordionExpanded_people=false;
    this.accordionExpanded_prj=false;
    this.accordionExpanded_track=false;
    this.accordionExpanded_tags=false;
    this.accordionExpanded_group=!this.accordionExpanded_group;
}//end for group

else if(flag=='prj')
{
  if(this.accordionExpanded_prj)
     {
      this.renderer.setElementStyle(this.cardContent_people.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_people.nativeElement,"padding","0px 16px");
      this.renderer.setElementStyle(this.cardContent_group.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_group.nativeElement,"padding","0px 16px");
      this.renderer.setElementStyle(this.cardContent_prj.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_prj.nativeElement,"padding","0px 16px");     
      this.renderer.setElementStyle(this.cardContent_track.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_track.nativeElement,"padding","0px 16px");  
      this.renderer.setElementStyle(this.cardContent_tags.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_tags.nativeElement,"padding","0px 16px");   
     }
    else{
      this.renderer.setElementStyle(this.cardContent_people.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_people.nativeElement,"padding","0px 16px"); 
      this.renderer.setElementStyle(this.cardContent_group.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_group.nativeElement,"padding","0px 16px");
      this.renderer.setElementStyle(this.cardContent_track.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_track.nativeElement,"padding","0px 16px"); 
      this.renderer.setElementStyle(this.cardContent_tags.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_tags.nativeElement,"padding","0px 16px");   
      let str="<searchInfo>";
      str+="<loggedInEmpId>"+this.loggedinUserId+"</loggedInEmpId>";
      str+="<searchType>PRJ</searchType>";
      str+="</searchInfo>";
      this.gomoservice.Search_Accordion(str).subscribe(data=>{
        console.log("project data",data);
        this.prj=[];
        this.prj=data.sort(this.compareValues('formTitle'));;
        this.renderer.setElementStyle(this.cardContent_prj.nativeElement,"max-height","500px");
        this.renderer.setElementStyle(this.cardContent_prj.nativeElement,"padding","13px 16px");
      })
    }
    this.accordionExpanded_people=false;
    this.accordionExpanded_group=false;
    this.accordionExpanded_track=false;
    this.accordionExpanded_tags=false;
    this.accordionExpanded_prj=!this.accordionExpanded_prj;
}//end for project

else if(flag=='track')
{
  if(this.accordionExpanded_track)
     {
      this.renderer.setElementStyle(this.cardContent_people.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_people.nativeElement,"padding","0px 16px");
      this.renderer.setElementStyle(this.cardContent_group.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_group.nativeElement,"padding","0px 16px");
      this.renderer.setElementStyle(this.cardContent_prj.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_prj.nativeElement,"padding","0px 16px");     
      this.renderer.setElementStyle(this.cardContent_track.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_track.nativeElement,"padding","0px 16px");  
      this.renderer.setElementStyle(this.cardContent_tags.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_tags.nativeElement,"padding","0px 16px");   
     }
    else{
      this.renderer.setElementStyle(this.cardContent_people.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_people.nativeElement,"padding","0px 16px"); 
      this.renderer.setElementStyle(this.cardContent_group.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_group.nativeElement,"padding","0px 16px");
      this.renderer.setElementStyle(this.cardContent_prj.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_prj.nativeElement,"padding","0px 16px"); 
      this.renderer.setElementStyle(this.cardContent_tags.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_tags.nativeElement,"padding","0px 16px");   
      let str="<searchInfo>";
      str+="<loggedInEmpId>"+this.loggedinUserId+"</loggedInEmpId>";
      str+="<searchType>TRK</searchType>";
      str+="</searchInfo>";
      this.gomoservice.Search_Accordion(str).subscribe(data=>{
        console.log("track data",data);
        this.track=[];
        this.track=data.sort(this.compareValues('formTitle'));;
        this.renderer.setElementStyle(this.cardContent_track.nativeElement,"max-height","500px");
        this.renderer.setElementStyle(this.cardContent_track.nativeElement,"padding","13px 16px");
      })
    }
    this.accordionExpanded_people=false;
    this.accordionExpanded_group=false;
    this.accordionExpanded_prj=false;
    this.accordionExpanded_tags=false;
    this.accordionExpanded_track=!this.accordionExpanded_track;
}//end for track

else if(flag=='tags')
{
  if(this.accordionExpanded_tags)
     {
      this.renderer.setElementStyle(this.cardContent_people.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_people.nativeElement,"padding","0px 16px");
      this.renderer.setElementStyle(this.cardContent_group.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_group.nativeElement,"padding","0px 16px");
      this.renderer.setElementStyle(this.cardContent_prj.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_prj.nativeElement,"padding","0px 16px");     
      this.renderer.setElementStyle(this.cardContent_track.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_track.nativeElement,"padding","0px 16px");  
      this.renderer.setElementStyle(this.cardContent_tags.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_tags.nativeElement,"padding","0px 16px");   
     }
    else{
      this.renderer.setElementStyle(this.cardContent_people.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_people.nativeElement,"padding","0px 16px"); 
      this.renderer.setElementStyle(this.cardContent_group.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_group.nativeElement,"padding","0px 16px");
      this.renderer.setElementStyle(this.cardContent_prj.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_prj.nativeElement,"padding","0px 16px"); 
      this.renderer.setElementStyle(this.cardContent_track.nativeElement,"max-height","0px");
      this.renderer.setElementStyle(this.cardContent_track.nativeElement,"padding","0px 16px");  
      let str="<searchInfo>";
      str+="<loggedInEmpId>"+this.loggedinUserId+"</loggedInEmpId>";
      str+="<searchType>TAG</searchType>";
      str+="</searchInfo>";
      this.gomoservice.Search_Accordion(str).subscribe(data=>{
        console.log("tag data",data);
        this.tags=[];
        this.tags=data.sort(this.compareValues('formTitle'));;
        this.renderer.setElementStyle(this.cardContent_tags.nativeElement,"max-height","500px");
        this.renderer.setElementStyle(this.cardContent_tags.nativeElement,"padding","13px 16px");
      })
    }
    this.accordionExpanded_people=false;
    this.accordionExpanded_group=false;
    this.accordionExpanded_prj=false;
    this.accordionExpanded_track=false;
    this.accordionExpanded_tags=!this.accordionExpanded_tags;
}//end for tags


}//end for toggle

 search(flag:any,obj:any)
 {
   if(flag=="p")
   {
     this.closeModal('CBU',obj.formRecordId,'');
   }
   else if(flag=="g")
   {
    this.closeModal('CBG',obj.formRecordId,'');
   }
   else if(flag=="tags")
   {
     this.closeModal('TAGS',obj.formTitle,obj.searchType);
   }
   else if(flag=="t")
   {
     this.closeModal('TRK',obj.formTitle,'');
   }
   else if(flag=="prj")
   {
     this.closeModal('PRJ',obj.searchTagTitle,'');
   }

 }

closeModal(flag,id,options)
{
    let data={
      flag:flag,
      id:id,
      options:options
    }
this.viewctrl.dismiss({'obj':data});
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


}//end for page
