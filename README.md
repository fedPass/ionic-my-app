# Start new Ionic Project

## Create an App
```bash
  ionic start photo-gallery blank --type=angular --capacitor
  cd photo-gallery
```


## PWA Elements​
```bash
  npm install @ionic/pwa-elements
```

in the src/main.ts
```bash
  import { defineCustomElements } from '@ionic/pwa-elements/loader';

  // Call the element loader after the platform has been bootstrapped
  defineCustomElements(window);
```
## Capacitor Plugins
```bash
  npm install @capacitor/{plugin}
```

es: npm install @capacitor/camera @capacitor/preferences @capacitor/filesystem

## Run App
```bash
  ionic serve
```
## Install Firebase
Install @angular/fire and firebase as dependencies

```bash
  npm install firebase @angular/fire
```

in enviroments.ts ( ed environment.prod.ts ), aggiungiamo alle variabili d'ambiente (si trovano su Firebase):

```bash
  firebase: {
    apiKey: 'xxx',
    authDomain: 'xxx',
    projectId: 'xxx',
    storageBucket: 'xxx',
    messagingSenderId: 'xxx',
    appId: 'xxx'
  }
```

in app.module.ts

```bash
  import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
  import { getFirestore, provideFirestore } from '@angular/fire/firestore';
  import { environment } from 'src/environments/environment';

    @NgModule({
    imports: [
        provideFirebaseApp(() => initializeApp(enviroments.firebase)),
        provideFirestore(() => getFirestore()),
    ],
    ...
    })
    export class AppModule { }
```
## Generate pages 
Generiamo le pagine per Login/Register
```bash
 ionic generate page pages/login
```

## Add AuthFire
in app.module.ts:

```bash
 import { provideAuth, getAuth } from '@angular/fire/auth';
 ...
  imports: [
    ...
    provideAuth(()=>getAuth()),
  ],
```

## Generate services
le logiche condivise (come quelle di Capacitor) possono essere incapsulate in un service:
```bash
 ionic generate service services/loginService
```
nel service iniettiamo l'auth e creiamo i metodi

```bash
import { Auth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from '@angular/fire/auth';
```

## Use Service into component
inietto il service nel component

```bash
  import { AuthFireService } from 'src/app/services/auth-fire.service';
  ...
  constructor(
    ...
    private authService: AuthFireService
  ) { }
```


## Manage routes
Possiamo gestire le rotte per utenti autentic/ non autent.

In app.routing.module.ts:
```bash
import { canActivate, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/compat/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['home']);

...

{
    path: '',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule),
    ...canActivate(redirectLoggedInToHome)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },

...

```

## Get user data in home component
Inietto authFireService nel componente Home per recuperare info user loggato e mostrarle in dashboard 

## Service to store/retry data 
*Abbiamo già importato Cloud Firestore (import { getFirestore } from "firebase/firestore"; in app.module)*

Creiamo un service per inviare/prendere dati con Cloud Firestore
```bash
  ionic generate service services/dataFire
```

nel componente
```bash
  import { Firestore } from '@angular/fire/firestore';
  import { addDoc, collection } from 'firebase/firestore'; 

    constructor(
    private dataService: Firestore
  ) { }

```

## Install @capacitor/geolocation
```bash
  npm install @capacitor/geolocation
  npx cap sync

```

This API requires the following permissions be added to your AndroidManifest.xml:

```bash
  <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
  <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
  <uses-feature android:name="android.hardware.location.gps" />

```

nel service in cui mi serve

```bash
  import { Geolocation } from '@capacitor/geolocation';
  ...
  const coords = await Geolocation.getCurrentPosition();

  ...

```
## Install Leaflet map
```bash
  npm i leaflet
  npm i --save-dev @types/leaflet 

  npm install --save @types/leaflet-routing-machine //per creare percorsi

```

index.html (import css and javascript for leaflet inside head)

```bash

  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
  integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
  crossorigin=""/>
  <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
   integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=="
   crossorigin=""></script>

```

in nuova page per la mappa, mentre nel suo template

```bash

 map.tes:

  ngAfterViewInit() {

    this.map = new Leaflet.Map('map').setView([-25.429397, -49.271165], 10);
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map'
        }).addTo(this.map);

}

________

map.template 

  <div id="map" class="map"></div>

```

## Create component to share elements
creiamo una componente "lista posizioni" da riutilizzare sia nella home che nella pagina my-map

```bash
  npm i leaflet
  npm i --save-dev @types/leaflet 

```

per condividere i componenti con gli altri moduli è necessario creare un modulo condiviso

```bash
  ionic g module modules/shared
```
nel module.ts condiviso
```bash

    import { NgModule } from '@angular/core';
    import { CommonModule } from '@angular/common';
    import { HeaderComponent } from './header/header.component';

    @NgModule({
    declarations: [HeaderComponent],
    imports: [
    CommonModule,
    ],
    exports: [HeaderComponent],
    })
    export class SharedComponentModule { }
    
```
adesso possiamo usare <app-header></app-header> nei vari template, ma dobbiamo prima importare nel loro module il module condiviso:

```bash
  ...
  import { SharedComponentModule } from '../component/shared-component.module';
    ...

  @NgModule({
  imports: [
    ...
    SharedComponentModule,
    ...
  
```

## Use Platform by ionic/angular to get info about device
importare nel componente

```bash
  import { Platform } from '@ionic/angular';

  @Component({...})
  export class MyPage {
    constructor(public platform: Platform) {

    }
  }

```

## Use Cloud Storage to store/retry user contents
importare nel ngModule il fireStorageModule

```bash

import { provideStorage, getStorage } from '@angular/fire/storage';

@NgModule({
  imports: [
    AngularFireStorageModule

```

nel componente


```bash

  import { AngularFireStorage } from '@angular/fire/compat/storage';
  constructor(private storage: Storage) { 

      uploadFile(event) {
      const file = event.target.files[0];
      const filePath = 'name-your-file-path-here';
      const task = this.storage.upload(filePath, file);
    }

    or 

    const storageRef = ref(this.storage, path);
    const uploadTask = uploadBytesResumable(storageRef, blob, metadata);

```

## At the end
Stoppare ionic serve, fare l abuild e aggiungere i due progetti per rispettivi devices

```bash
  ionic build
  ionic cap add android
  ionic cap add ios
  ionic cap copy
  ionic cap sync

```

Aprire Andriod Studio e settare permessi necessari nel AndroidManifest.xml

```bash
ionic cap open android

```

Click the "Run" button, select the attached Android device, 
then click OK to build, install, and launch the app on your device.

