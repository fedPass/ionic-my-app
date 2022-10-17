import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthFireService, User } from '../services/auth-fire.service';

import { AlertController } from '@ionic/angular';

import { DataFireService } from '../services/data-fire.service';
import { CameraService } from '../services/camera.service';
import { NetworkService } from '../services/network.service';
import { Subscription } from 'rxjs';
import { NGXLogger } from 'ngx-logger';

const LOG_PREFIX = '[Home-page] ';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  user: User;
  connected = true;
  userSub: Subscription;
  networkSub: Subscription;

  constructor(
    private auth: AuthFireService,
    private router: Router,
    private alertCtrl: AlertController,
    private data: DataFireService,
    private cameraService: CameraService,
    private network: NetworkService,
    private logger: NGXLogger,
  ) {  }

  ngOnInit(): void {
    this.networkSub = this.network.status.subscribe(
      (status) => {
        if(status) {this.connected = status.connected;}
      }
    );
    this.userSub = this.auth.userSub.subscribe(
      (user) => { this.user = user; }
    );
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.networkSub.unsubscribe();
  }

  async logout() {
    await this.auth.logout();
    this.router.navigateByUrl('/', {replaceUrl: true });
  }

  async updateUserName() {
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

  async addNewPosition() {
    let newPosName = '';
    const alert = await this.alertCtrl.create({
      header: 'Inserisci un nuovo luogo visitato',
      buttons: [
        {
          text: 'Aggiungi',
          handler: (res) => {
            console.log('res',res, typeof res);
            if(res.name.length > 0) {
              newPosName = res.name.trim();
              console.log('newPosName',newPosName);
              this.data.addPosition(
                {
                  name: res.name.trim(),
                }, this.user);
              }
            }
          },
          {
            text: 'Chiudi',
            role: 'cancel'
          },
    ],
      inputs: [
        {
          name: 'name',
          placeholder: 'Name',
          type: 'text'
        }
      ],
    });
    alert.present();

    await alert.onDidDismiss().then(
      async () => {
        if (newPosName === '') {
          const errorAlert = await this.alertCtrl.create({
            header: 'Ops! Salvataggio non riuscito! Devi Inserire un nome per inserire un nuovo luogo',
            buttons: [
                {
                  text: 'Chiudi',
                  role: 'cancel'
                },
          ]});
          errorAlert.present();
        }
      }
    );
  }

}
