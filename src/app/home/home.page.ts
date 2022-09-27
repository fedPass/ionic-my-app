import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { AuthFireService } from '../services/auth-fire.service';

import { AlertController } from '@ionic/angular';
import { DataFireService } from '../services/data-fire.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  user = null;
  positionsList = [];

  constructor(
    private auth: AuthFireService,
    private router: Router,
    private alertCtrl: AlertController,
    private dataFire: DataFireService
  ) {
    this.user = this.auth.getUserProfile();
    console.log('user',this.user);

    this.dataFire.getUserPositions(this.user)
    .subscribe( (res)  => {
      this.positionsList = res;
      console.log('position after subscribe',this.positionsList);
    });
  }

  ngOnInit(): void {
  }

  async logout() {
    await this.auth.logout();
    this.router.navigateByUrl('/', {replaceUrl: true });
  }

  async addNewPosition() {
    const alert = await this.alertCtrl.create({
      header: 'Inserisci un nuovo luogo visitato',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'add',
          handler: (res) => {
            this.dataFire.addPosition(
              {
              name: res.name,
              },
              this.user
            );
          }
        }
    ],
      inputs: [
        {
          name: 'name',
          placeholder: 'Name',
        },
        //#TODO: come inserire foto? btn che richiama getPhoto()?
        // {
        //   name: 'photo',
        //   placeholder: 'photo',
        //   type: 'url'
        // }
      ],
    });

    alert.present();
  }

}
