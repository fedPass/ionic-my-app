import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as Leaflet from 'leaflet';
import { Geolocation } from '@capacitor/geolocation';
import { DataFireService } from 'src/app/services/data-fire.service';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-my-map',
  templateUrl: './my-map.page.html',
  styleUrls: ['./my-map.page.scss'],
})
export class MyMapPage implements OnInit, AfterViewInit {
  map = null;
  positionsList = [];

  constructor(
    private dataFire: DataFireService,
    private auth: Auth
  ) {
  }

  async ngOnInit() {
    // create map with current coords
    const coords = await Geolocation.getCurrentPosition();
    this.map = new Leaflet.Map('map').setView([coords.coords.latitude, coords.coords.longitude], 10);
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map'
    }).addTo(this.map);

  }

  ngAfterViewInit() {

    this.dataFire.getUserPositions(this.auth.currentUser)
    .subscribe( (res)  => {
      this.positionsList = res;
      this.positionsList.forEach( (position, i) => {
        const latitude = position.coords.lat;
        const longitude = position.coords.lon;
        const marker = Leaflet.marker([latitude, longitude], {
          title: position.name
        }).addTo(this.map);
        marker.bindPopup(`<b>${position.name}</b><br>`).openPopup();

      });
      //add marker for here
      Geolocation.getCurrentPosition().then(
        (resPosition) => {
          const here = Leaflet.marker([resPosition.coords.latitude, resPosition.coords.longitude], {
            title: 'here'
          }).addTo(this.map);
          here.bindPopup(`<b>Sei qui!</b><br>Lat: ` + resPosition.coords.latitude + `, Lon: ` + resPosition.coords.longitude).openPopup();
        }
      );
    });

  }

  // #TODO: se sono in hover sulla posizione nella lista attiva marker sulla mappa

}
