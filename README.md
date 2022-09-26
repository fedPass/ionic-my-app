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

## Service usage into component
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


