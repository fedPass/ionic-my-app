import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as Leaflet from 'leaflet';
import { Geolocation } from '@capacitor/geolocation';
import { DataFireService, Position } from 'src/app/services/data-fire.service';
import { Observable, } from 'rxjs';
import {fromPromise} from 'rxjs/internal-compatibility';

@Component({
  selector: 'app-my-map',
  templateUrl: './my-map.page.html',
  styleUrls: ['./my-map.page.scss'],
})
export class MyMapPage implements OnInit, AfterViewInit {
  map: Leaflet.Map;
  positionsList$: Observable<Position[]>;
  currentCoords$: Observable<any>;

  constructor(
    private dataFire: DataFireService
  ) {
    this.positionsList$ = this.dataFire.userPositions$;
    this.currentCoords$ = fromPromise(Geolocation.getCurrentPosition());
  }

  async ngOnInit() {
    // create map with current coords
    this.currentCoords$.subscribe(
      (resPosition) => {
        this.map = new Leaflet.Map('map').setView([+resPosition.coords.latitude, +resPosition.coords.longitude], 10);
        Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map'
        }).addTo(this.map);
      }
    );

  }

  ngAfterViewInit() {
    //add marker of positions on map
    this.positionsList$.subscribe(
      (res)  => {
      res.forEach( (position, i) => {
        const marker = Leaflet.marker([+position.coords.lat, +position.coords.lon], {
          title: position.name
        }).addTo(this.map);
        marker.bindPopup(`<b>${position.name}</b><br>`).openPopup();

      });
      //TODO: mostrare solo se non è tra le posizioni dell'utente
      //se posizioni coincidono mostra solo l'ultima (come se sovrascrive quel punto nella mappa)
      // add current position marker
      this.currentCoords$.subscribe(
        (resPosition) => {
          const latitude = resPosition.coords.latitude;
          const longitude = resPosition.coords.longitude;
          const here = Leaflet.marker([+latitude, +longitude], {
            title: 'here'
          }).addTo(this.map);
          here.bindPopup(`<b>Sei qui!</b><br><small>Lat: ${latitude}<br>Lon: ${longitude}</small>`).openPopup();
        }
      );
    });

  }

  // #TODO: se sono in hover sulla posizione nella lista attiva marker sulla mappa

}
