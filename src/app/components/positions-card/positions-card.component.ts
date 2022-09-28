import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AuthFireService } from 'src/app/services/auth-fire.service';
import { DataFireService } from 'src/app/services/data-fire.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-positions-card',
  templateUrl: './positions-card.component.html',
  styleUrls: ['./positions-card.component.scss'],
})
export class PositionsCardComponent implements OnInit {
  user = null;
  positionsList = [];
  isMapPage = false;

  constructor(
    private auth: AuthFireService,
    private dataFire: DataFireService,
    private alertCtrl: AlertController,
    public platform: Platform
  ) {
    this.user = this.auth.getUserProfile();

    this.dataFire.getUserPositions(this.user)
    .subscribe( (res)  => {
      this.positionsList = res;
    });

    const currentUrl = this.platform.url();
    const pageUrl = currentUrl.substr(currentUrl.lastIndexOf('/') + 1);
    this.isMapPage = pageUrl === 'my-map' ? true : false;
  }

  ngOnInit() {}

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
        // UPLOAD FILE: https://firebase.google.com/docs/storage/web/upload-files
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

}