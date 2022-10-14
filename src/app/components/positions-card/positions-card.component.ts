import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AuthFireService, User } from 'src/app/services/auth-fire.service';
import { DataFireService, Position } from 'src/app/services/data-fire.service';
import { Platform } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { GeolocationService } from 'src/app/services/geolocation.service';

const LOG_PREFIX = '[Position-card-component] ';

@Component({
  selector: 'app-positions-card',
  templateUrl: './positions-card.component.html',
  styleUrls: ['./positions-card.component.scss'],
})
export class PositionsCardComponent implements OnInit {
  user: User;
  isMapPage = false;
  positionsList$: Observable<Position[]>;

  constructor(
    private auth: AuthFireService,
    private dataFire: DataFireService,
    private alertCtrl: AlertController,
    public platform: Platform,
    private geoservice: GeolocationService
  ) {
    this.user = this.auth.getUserProfile();
    //se uso questo quando cambio user non si aggiornano le positions in home
    // this.positionsList$ = this.dataFire.userPositions$;
    this.positionsList$ = this.dataFire.getUserPositions(this.user);
    const pageUrl = this.platform.url().substr(this.platform.url().lastIndexOf('/') + 1);
    this.isMapPage = pageUrl === 'my-map' ? true : false;
  }

  async ngOnInit() {
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
              this.dataFire.addPosition(
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

  deletePosition(position) {
    this.dataFire.deletePosition(position,this.user);
  }

  async updatePosition(position) {
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

  onSelectedPosition(position: Position) {
    this.geoservice.onSelectedPosition(position);
  }

}
