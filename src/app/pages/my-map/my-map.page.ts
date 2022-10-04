import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import * as Leaflet from 'leaflet';
import { Geolocation } from '@capacitor/geolocation';
import { DataFireService, Position } from 'src/app/services/data-fire.service';
import { Observable, Subscription, } from 'rxjs';
import {fromPromise} from 'rxjs/internal-compatibility';
import {NGXLogger} from 'ngx-logger';
import { isPlatform, Platform } from '@ionic/angular';

const LOG_PREFIX = '[My-map-page] ';

@Component({
  selector: 'app-my-map',
  templateUrl: './my-map.page.html',
  styleUrls: ['./my-map.page.scss'],
})
export class MyMapPage implements OnInit, AfterViewInit, OnDestroy {
  map: Leaflet.Map;
  positionsList$: Observable<Position[]>;
  currentCoords$: Observable<any>;
  currentCoordsSubscription: Subscription;
  positionsListSubscription: Subscription;

  constructor(
    private dataFire: DataFireService,
    private logger: NGXLogger,
    private platform: Platform
  ) {
    this.positionsList$ = this.dataFire.userPositions$;
    this.currentCoords$ = fromPromise(Geolocation.getCurrentPosition());
  }

  async ngOnInit() {
    // create map with current coords
    this.currentCoordsSubscription = this.currentCoords$.subscribe(
      (resPosition) => {
        if (isPlatform('mobile')) {
          this.logger.debug(LOG_PREFIX + 'current latitude ', resPosition.coords.latitude);
          this.logger.debug(LOG_PREFIX + 'current longitude ', resPosition.coords.longitude);
        } else {
          this.logger.debug(LOG_PREFIX + 'current longitude ', resPosition.coords);
        }
        this.map = new Leaflet.Map('map').setView([+resPosition.coords.latitude, +resPosition.coords.longitude], 10);
        Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map'
        }).addTo(this.map);
        // add current position marker
        const latitude = resPosition.coords.latitude;
        const longitude = resPosition.coords.longitude;
        const here = Leaflet.marker([+latitude, +longitude], {
          title: 'here'
        }).addTo(this.map);
        here.bindPopup(`<b>Sei qui!</b><br><small>Lat: ${latitude}<br>Lon: ${longitude}</small>`).openPopup();
      }
    );

  }

  ngAfterViewInit() {
    //add marker of positions on map
    this.positionsListSubscription = this.positionsList$.subscribe(
      (res)  => {
        if (res.length > 0) {
          setTimeout(() => {
            res.forEach( (position, i) => {
              const marker = Leaflet.marker([+position.coords.lat, +position.coords.lon], {
                title: position.name
              }).addTo(this.map);
              marker.bindPopup(`<b>${position.name}</b><br>`);
              if (isPlatform('mobile')) {
              this.logger.debug(LOG_PREFIX + ' position n. ' + (i+1), position.name);
              } else {
              this.logger.debug(LOG_PREFIX + ' position n. ' + (i+1), position);
              }
            });
          }, 300);
        }
    });
  }

  // #TODO: se sono in hover sulla posizione nella lista attiva marker sulla mappa

  ngOnDestroy(): void {
    if (this.currentCoordsSubscription) {
      this.currentCoordsSubscription.unsubscribe();
    }
    if (this.positionsListSubscription) {
      this.positionsListSubscription.unsubscribe();
    }

  }

}
