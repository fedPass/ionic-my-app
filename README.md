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
