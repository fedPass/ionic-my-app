import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as Leaflet from 'leaflet';
import { Geolocation } from '@capacitor/geolocation';
import { DataFireService, Position } from 'src/app/services/data-fire.service';
import { Observable, } from 'rxjs';
import {fromPromise} from 'rxjs/internal-compatibility';
import {NGXLogger} from 'ngx-logger';

const LOG_PREFIX = '[My-map-page] ';

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
    private dataFire: DataFireService,
    private logger: NGXLogger
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
    setTimeout(() => {
      //add marker of positions on map
      this.positionsList$.subscribe(
        (res)  => {
          if (res.length > 0) {
            res.forEach( (position, i) => {
              this.logger.debug(LOG_PREFIX + ' position n. ' + (i+1), position);
              const marker = Leaflet.marker([+position.coords.lat, +position.coords.lon], {
                title: position.name
              }).addTo(this.map);
              marker.bindPopup(`<b>${position.name}</b><br>`).openPopup();
            });
          }
        //TODO: mostrare solo se non è tra le posizioni dell'utente
        //se posizioni coincidono come se sovrascrive quel punto nella mappa
        // add current position marker
        this.currentCoords$.subscribe(
          (resPosition) => {
            if (resPosition) {
              this.logger.debug(LOG_PREFIX + 'current coords ', resPosition.coords);
              const latitude = resPosition.coords.latitude;
              const longitude = resPosition.coords.longitude;
              const here = Leaflet.marker([+latitude, +longitude], {
                title: 'here'
              }).addTo(this.map);
              here.bindPopup(`<b>Sei qui!</b><br><small>Lat: ${latitude}<br>Lon: ${longitude}</small>`).openPopup();
            }
          }
        );
      });
    }, 300);

  }

  // #TODO: se sono in hover sulla posizione nella lista attiva marker sulla mappa

}
