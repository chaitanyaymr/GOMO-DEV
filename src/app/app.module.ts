import { ModalTranslateLeaveTransition } from './../pages/home/AnimationLeave';
import { ModalTranslateEnterTransition } from './../pages/home/AnimationEnter';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule, Config } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import {SQLite} from '@ionic-native/sqlite';
import { StatusBar } from '@ionic-native/status-bar';
import { Gomo_tm } from './app.component';
import {GomoEnvironment} from '../common/gomoenvironmnet';
import { GomoServiceProvider } from '../providers/gomo-service/gomo-service';
 import { FCM } from '@ionic-native/fcm';
 import { GomodbServiceProvider } from '../providers/gomodb-service/gomodb-service';
import { SignalRServiceProvider } from '../providers/signal-r-service/signal-r-service';
import { Network } from '@ionic-native/network';
import {NativeStorage} from '@ionic-native/native-storage';
import { LocalNotifications } from '@ionic-native/local-notifications';

@NgModule({
  declarations: [
    Gomo_tm,
    
  ],
  imports: [
    BrowserModule,HttpModule,
    IonicModule.forRoot(Gomo_tm),
   
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    Gomo_tm,
   
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GomoEnvironment,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GomoServiceProvider,
    FCM,Network,
    GomodbServiceProvider,
    SQLite,SignalRServiceProvider,
    NativeStorage,
    LocalNotifications

  ]
})
export class AppModule {
  constructor(public config: Config) {
    this.setCustomTransitions();
}
private setCustomTransitions() {
    this.config.setTransition('modal-translate-up-enter', ModalTranslateEnterTransition);
    this.config.setTransition('modal-translate-up-leave', ModalTranslateLeaveTransition);
}
}
