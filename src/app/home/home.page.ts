import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthFireService, User } from '../services/auth-fire.service';

import { AlertController } from '@ionic/angular';

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { DataFireService } from '../services/data-fire.service';
import { CameraService } from '../services/camera.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  user: User;

  constructor(
    private auth: AuthFireService,
    private router: Router,
    private alertCtrl: AlertController,
    private data: DataFireService,
    private cameraService: CameraService
  ) {
    //TODO dovrebbe essere un observable di user? forse si!
    this.user = this.auth.getUserProfile();
  }

  ngOnInit(): void {
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
