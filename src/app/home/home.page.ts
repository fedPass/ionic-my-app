import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthFireService, User } from '../services/auth-fire.service';

import { AlertController } from '@ionic/angular';

import { DataFireService } from '../services/data-fire.service';
import { CameraService } from '../services/camera.service';
import { NetworkService } from '../services/network.service';
import { Observable, from, of } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/fromPromise';
import { NGXLogger } from 'ngx-logger';

const LOG_PREFIX = '[Home-page] ';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  user: User;
  // user$: Observable<User>;

  // networkStatus$: Observable<boolean>;
  // isNetworkAvaible: boolean;

  constructor(
    private auth: AuthFireService,
    private router: Router,
    private alertCtrl: AlertController,
    private data: DataFireService,
    private cameraService: CameraService,
    private network: NetworkService,
    private logger: NGXLogger
  ) {
    // this.network.isConnectedCheck2().then(
    //   (isConnected) => {
    //     this.isNetworkAvaible = isConnected;
    //   }
    // );
    // this.networkStatus$ = fromPromise(this.network.isConnectedCheck2());
    // this.logger.debug(LOG_PREFIX + 'Current Network Status : ', this.networkStatus$.subscribe(console.log));
    this.user = this.auth.getUserProfile();
    // this.logger.debug(LOG_PREFIX + 'Current User: ', this.user);
    // this.user$ = this.auth.user$;
    // this.logger.debug(LOG_PREFIX + 'Current OBSERVABLE User: ', this.user$.subscribe(console.log));
  }

  ngOnInit(): void {
    // this.networkStatus$ = fromPromise(this.network.isConnectedCheck());
    // this.networkStatus$ = this.network.isNetworkAvaible ? of(true) : of(false);
  }

  async logout() {
    await this.auth.logout();
    this.user = null;
    this.router.navigateByUrl('/', {replaceUrl: true });
  }

  async updateUserName() {
    // let email = null;
    // let name = null;
    // this.user$.subscribe( user => {
    //   email = user.email;
    //   name = user.displayName;
    // });
    const alert = await this.alertCtrl.create({
      header: 'Modifica username per "' + this.user.email + '"',
      buttons: [
        {
          text: 'Chiudi',
          role: 'cancel'
        },
        {
          text: 'Modifica',
          handler: (res) => {
            this.auth.updateUserName(
              {
                displayName: res.displayName
              }
             );
          }
        }
    ],
      inputs: [
        {
          name: 'displayName',
          placeholder: this.user.displayName,
          value: this.user.displayName,
        }
      ],
    });
    alert.present();
  }

  async updateUserPhoto() {
    const alert = await this.alertCtrl.create({
      header: 'Foto profilo',
      buttons: [
        {
          text: 'Chiudi',
          role: 'cancel'
        },
        {
          text: 'Carica/Scatta',
          handler: async () => {
            await this.cameraService.getPhotoByCamera().then(
              async (blob) => {
                await this.data.uploadImageForUser(blob, true);
              }
            );
        }
      }
    ]
    });
    alert.present();
  }

}
