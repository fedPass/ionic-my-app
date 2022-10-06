import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthFireService, User } from '../services/auth-fire.service';

import { AlertController } from '@ionic/angular';

import { DataFireService } from '../services/data-fire.service';
import { CameraService } from '../services/camera.service';
import { NetworkService } from '../services/network.service';
import { Observable, from, of } from 'rxjs';
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

  connected = true;

  constructor(
    private auth: AuthFireService,
    private router: Router,
    private alertCtrl: AlertController,
    private data: DataFireService,
    private cameraService: CameraService,
    private network: NetworkService,
    private logger: NGXLogger
  ) {
    this.user = this.auth.getUserProfile();
    this.network.getStatusObservable().subscribe((status) => {
      if (status) { this.connected = status.connected; }
    });
  }

  ngOnInit(): void {
  }

  async logout() {
    await this.auth.logout();
    this.user = null;
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

}
