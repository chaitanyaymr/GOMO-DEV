import {Http,RequestOptions,Response} from '@angular/http';
import { Injectable } from '@angular/core';
import {SQLite,SQLiteObject} from '@ionic-native/sqlite';
import { Platform } from 'ionic-angular';
import { BehaviorSubject, Observable } from 'rxjs';
/*
  Generated class for the GomodbServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GomodbServiceProvider {

  private db:SQLiteObject;
  private isOpen:boolean;
  private databaseReady: BehaviorSubject<boolean>;
  loc:string="";
  private getDataObserver: any;
  public getData: any;
  constructor(public http: Http,public platform:Platform,public storage:SQLite) 
  {
    console.log('Hello GomodbServiceProvider Provider');
    this.loc=platform.is('ios')==true?"Library":"default";
    this.databaseReady=new BehaviorSubject(false);
    platform.ready().then(()=>{
      this.createDB(this.isOpen);
     })
     this.getDataObserver = null;
    this.getData = Observable.create(observer => {
        this.getDataObserver = observer;
    });
  }

  createDB(open:boolean)
  {
    console.log(open);
    if(!open)
    {
      this.storage=new SQLite();
      if(this.platform.is('android'))
      {
        this.storage.create({name:"gomoUser.db",location:this.loc}).then((db:SQLiteObject)=>{
          this.db=db;
          db.executeSql("CREATE TABLE  IF NOT EXISTS tblgomoUser(id INTEGER PRIMARY KEY AUTOINCREMENT,UserID TEXT,UserImage TEXT,userFName TEXT,userLName TEXT, LoginId TEXT, Password TEXT,userGroupTitle TEXT,useGroupId TEXT,Token TEXT,userType TEXT,Rem TEXT,userMemberId TEXT,userCheckInId TEXT,userMailId TEXT)",[]);
          this.isOpen=true;
          console.log("Database Created");
          this.databaseReady.next(true);
          }).catch((error)=>{console.log("Error while creation",error)});
      }
      else if(this.platform.is('ios'))
      {
        this.storage.create({name:"gomoUser.db",iosDatabaseLocation:this.loc}).then((db:SQLiteObject)=>{
          this.db=db;
          db.executeSql("CREATE TABLE  IF NOT EXISTS tblgomoUser(id INTEGER PRIMARY KEY AUTOINCREMENT,UserID TEXT,UserImage TEXT,userFName TEXT,userLName TEXT, LoginId TEXT, Password TEXT,userGroupTitle TEXT,useGroupId TEXT,Token TEXT,userType TEXT,Rem TEXT,userMemberId TEXT,userCheckInId TEXT,userMailId TEXT)",[]);
          this.isOpen=true;
          console.log("Database Created");
          this.databaseReady.next(true);
          }).catch((error)=>{console.log("Error while creation",error)});
      }

           

  }
}
public getDatabaseState()
{
  return this.databaseReady.asObservable();
}

createUser(Uid:any,uimage:any,FName:string,LName:string,loginid:string,password:string,roleid:string,rolename:string,token:any,rem:any,empuserMemberId:string,userCheckInId:any,userType:any,umail:any)
{
  return new Promise((resolve,reject)=>{
      this. deleteUser();
    let query="INSERT INTO tblgomoUser (UserID,UserImage,userFName,userLName,LoginId,Password,userGroupTitle,useGroupId,Token,Rem,userMemberId,userCheckInId,userType,userMailId) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    this.db.executeSql(query,[Uid,uimage,FName,LName,loginid,password,rolename,roleid,token,rem,empuserMemberId,userCheckInId,userType,umail])
           .then((data)=>{
             resolve(data);
           },(error)=>{reject(error)}
          );
    });
}

deleteUser()
  {
    return new Promise((resolve,rekject)=>{
         let query="DELETE FROM  tblgomoUser ";
           this.db.executeSql(query,[])
                  .then((data)=>{
                    this.db.executeSql("DELETE FROM SQLITE_SEQUENCE WHERE name='tblgomoUser'",[]).then((res)=>{
                    });
                    resolve(data)
                  },(error)=>{resolve(error)}
                )
    })
  }



  getAllUsers()
  {
    return new Promise((resolve,reject)=>{
       let query="SELECT * FROM tblgomoUser";
       this.db.executeSql(query,[])
              .then((data)=>{
               let users=[];
               for(var i=0;i<data.rows.length;i++)
               {
                 users.push({
                  id:data.rows.item(i).id,
                  UserId:data.rows.item(i).UserID,
                  UserImage:data.rows.item(i).UserImage,
                  userFName:data.rows.item(i).userFName,
                  userLName:data.rows.item(i).userLName,
                  LoginId:data.rows.item(i).LoginId,
                  Password:data.rows.item(i).Password,
                  Rolename:data.rows.item(i).userGroupTitle,
                  RoleID:data.rows.item(i).useGroupId,
                  Token:data.rows.item(i).Token,
                  Rem:data.rows.item(i).Rem,
                  userType:data.rows.item(i).userType,
                  userMemberId:data.rows.item(i).userMemberId,
                  userCheckInId:data.rows.item(i).userCheckInId,
                  userMailId:data.rows.item(i).userMailId
                 });
               }
              resolve(users);

              },(error)=>{
                reject(error)
              });
    });
  }
  updateUser(uid,fname,lname,email,phone,img)
  {
    return new Promise((resolve,reject)=>{

      let query="Update tblgomoUser SET userFName=?,userLName=?,userMailId=?,UserImage=?";
      this.db.executeSql(query,[fname,lname,email,img])
      .then((data)=>{
        let user:any={};
        this.getAllUsers().then(data=>{
          user=data[0];
          this.getDataObserver.next(user);
        })

         resolve(data);
      },(error)=>{reject(error)}
    );
    })
  }

  

}
