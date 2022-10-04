import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { environment } from 'src/environments/environment';
import { ComponentsModule } from './components/components.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AngularFireModule} from '@angular/fire/compat';
import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideStorage, getStorage } from '@angular/fire/storage';

// Firebase services - importando i moduli così non va
// import { AngularFireModule } from '@angular/fire/compat';
// import { AngularFireAuthModule } from '@angular/fire/compat/auth';
// import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AuthFireService } from './services/auth-fire.service';
// import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

import {LoggerModule, NgxLoggerLevel} from 'ngx-logger';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ComponentsModule,

    AngularFireModule.initializeApp(environment.firebase),
    provideFirebaseApp(() => initializeApp(environment.firebase)), //trick per evitare error
    provideFirestore(() => getFirestore()),
    provideAuth(()=>getAuth()),
    provideStorage(() => getStorage()),
    // AngularFireAuthModule,
    // AngularFirestoreModule,
    // AngularFireStorageModule,
    LoggerModule.forRoot({
      level: NgxLoggerLevel.DEBUG,
    })
  ],
  //disponibili per tutta l'app
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // AuthFireService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
