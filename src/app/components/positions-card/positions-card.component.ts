import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AuthFireService, User } from 'src/app/services/auth-fire.service';
import { DataFireService, Position } from 'src/app/services/data-fire.service';
import { Platform } from '@ionic/angular';
import { Observable } from 'rxjs';

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
    public platform: Platform
  ) {
    this.user = this.auth.getUserProfile();
    //se uso questo quando cambio user non si aggiornano le positions in home
    // this.positionsList$ = this.dataFire.userPositions$;
    this.positionsList$ = this.dataFire.getUserPositions(this.user);
    const pageUrl = this.platform.url().substr(this.platform.url().lastIndexOf('/') + 1);
    this.isMapPage = pageUrl === 'my-map' ? true : false;
  }

  ngOnInit() {}

  async addNewPosition() {
    const alert = await this.alertCtrl.create({
      header: 'Inserisci un nuovo luogo visitato',
      buttons: [
        {
          text: 'Aggiungi',
          handler: (res) => {
            this.dataFire.addPosition(
              {
                name: res.name,
              },
              this.user
              );
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
        }
      ],
    });
    alert.present();
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

}
