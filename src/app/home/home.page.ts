import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthFireService } from '../services/auth-fire.service';

import { AlertController } from '@ionic/angular';

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { DataFireService } from '../services/data-fire.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  user = null;
  userAvatarUrl = null;

  constructor(
    private auth: AuthFireService,
    private router: Router,
    private alertCtrl: AlertController,
    private data: DataFireService
  ) {
    // this.user = this.auth.getUserProfile();
    this.user = this.auth.userData;
    this.data.getUserProfilePhotoUrl().then(
      (url) => {
        this.userAvatarUrl = url;
      }
    );

  }

  ngOnInit(): void {
  }

  async logout() {
    await this.auth.logout();
    this.router.navigateByUrl('/', {replaceUrl: true });
  }

  async updateUserInfo() {
    // console.log('click update user');
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
            this.auth.updateUserInfo(
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
      header: 'Cambia foto profilo',
      buttons: [
        {
          text: 'Chiudi',
          role: 'cancel'
        },
        {
          text: 'Carica/Scatta',
          handler: async () => {
            const photo = await Camera.getPhoto({
              quality: 90,
              allowEditing: true,
              resultType: CameraResultType.Uri,
              source: CameraSource.Camera
            });
            if (photo) {
              const photoUrl = await this.data.uploadImageForUser(photo, true);
              // const photoUrl = this.data.uploadUserPh(photo, true);
            }
        }
      }
    ]
    });
    alert.present();
  }

}
