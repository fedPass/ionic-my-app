import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthFireService } from '../services/auth-fire.service';

import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  user = null;

  constructor(
    private auth: AuthFireService,
    private router: Router,
    private alertCtrl: AlertController,
  ) {
    this.user = this.auth.getUserProfile();
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

}
