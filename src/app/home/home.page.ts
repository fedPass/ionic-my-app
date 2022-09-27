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
          text: 'Chiudi',
          role: 'cancel'
        },
        {
          text: 'Aggiugni',
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

  deletePosition(position) {
    this.dataFire.deletePosition(position,this.user);
  }

  async updatePosition(position) {
    console.log('click update');
    const alert = await this.alertCtrl.create({
      header: 'Modifica "' + position.name + '"',
      buttons: [
        {
          text: 'Chiudi',
          role: 'cancel'
        },
        {
          text: 'Modifica',
          handler: (res) => {
            this.dataFire.updateNamePosition(
              {
              name: res.name,
              id: position.id
              },
              this.user
            );
          }
        }
    ],
      inputs: [
        {
          name: 'name',
          placeholder: position.name,
        }
      ],
    });
    alert.present();
  }

  async updateUserInfo() {
    console.log('click update user');
    const alert = await this.alertCtrl.create({
      header: 'Modifica "' + this.user.email + '"',
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
              }            );
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
