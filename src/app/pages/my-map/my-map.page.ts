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
    this.dataFire.getUserPositions(this.auth.currentUser)
    .subscribe( (res)  => {
      this.positionsList = res;
    });
  }

  ngOnInit() {
  }

  async ngAfterViewInit() {

    // create map with current coords
    const coords = await Geolocation.getCurrentPosition();
    this.map = new Leaflet.Map('map').setView([coords.coords.latitude, coords.coords.longitude], 10);
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map'
        }).addTo(this.map);

    //add marker for here
    const here = Leaflet.marker([coords.coords.latitude, coords.coords.longitude], {
      title: 'Sei qui!'
    }).addTo(this.map);
    here.bindPopup(`<b>Sei qui!</b><br>Lat: ` + coords.coords.latitude + `, Lon: ` + coords.coords.longitude).openPopup();

    //#TODO: i need to retry user positions to loop its and add marker
    // console.log('positionsList',this.positionsList);
    this.positionsList.forEach( position => {
      const latitude = position.coords.lat;
      const longitude = position.coords.lon;
      Leaflet.marker([latitude, longitude], {
        title: position.name
      }).addTo(this.map);
    });


}

}
