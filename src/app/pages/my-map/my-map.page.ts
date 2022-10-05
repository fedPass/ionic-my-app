import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import 'leaflet';
// import {L} from 'leaflet';
import 'leaflet-routing-machine';
import { Geolocation } from '@capacitor/geolocation';
import { DataFireService, Position } from 'src/app/services/data-fire.service';
import { Observable, Subscription, } from 'rxjs';
import {fromPromise} from 'rxjs/internal-compatibility';
import {NGXLogger} from 'ngx-logger';
import { isPlatform, Platform } from '@ionic/angular';

const LOG_PREFIX = '[My-map-page] ';
//trick per importare moduli che stanno nello stesso namespace
declare let L: any;

@Component({
  selector: 'app-my-map',
  templateUrl: './my-map.page.html',
  styleUrls: ['./my-map.page.scss'],
})
export class MyMapPage implements OnInit, AfterViewInit, OnDestroy {
  map: L.Map;
  positionsList$: Observable<Position[]>;
  currentCoords$: Observable<any>;
  currentCoordsSubscription: Subscription;
  positionsListSubscription: Subscription;
  receivedPosition: Position;

  constructor(
    private dataFire: DataFireService,
    private logger: NGXLogger,
    private platform: Platform
  ) {
    this.positionsList$ = this.dataFire.userPositions$;
    this.currentCoords$ = fromPromise(Geolocation.getCurrentPosition());
    if (window.location.href.includes('?')) {
      const url = new URL(window.location.href);
      const searchParams = new URLSearchParams(url.search);
      this.receivedPosition = {
        coords: {
          lat: searchParams.get('lat'),
          lon: searchParams.get('lon')
        },
        name: searchParams.get('name')
      };
    }
  }

  async ngOnInit() {
    if (this.receivedPosition) {
      //create map with received coords
      if (!isPlatform('mobile')) {
        this.logger.debug(LOG_PREFIX + 'received position ', this.receivedPosition);
      }
      this.map = new L.Map('map');

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);

      this.currentCoordsSubscription = this.currentCoords$.subscribe(
        (resCurrPos) => {
          //traccia percorso da posizione corrente a punto ricevuto
          L.Routing.control({
            waypoints: [
              L.latLng(+resCurrPos.coords.latitude, +resCurrPos.coords.longitude),
              L.latLng(+this.receivedPosition.coords.lat, +this.receivedPosition.coords.lon)
            ],
            routeWhileDragging: true,
            autoRoute: true,
            showAlternatives: true,
            show: false,
            z: 10
            //router: new L.Routing.OSRMv1({ serviceUrl: mapConfigs.osrmUrl }), //per la versione prod ci vorrebbe un serviceUrl
          }).addTo(this.map);
          //riposiziona su posto corrente e fai zoom (se no parte dal mondo)
          this.map.setView([+resCurrPos.coords.latitude, +resCurrPos.coords.latitude]);
        }
      );
    } else {
      // create map with current coords
      this.currentCoordsSubscription = this.currentCoords$.subscribe(
        (resPosition) => {
          this.map = new L.Map('map').setView([+resPosition.coords.latitude, +resPosition.coords.longitude], 10);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: 'Map'
          }).addTo(this.map);
          if (isPlatform('mobile')) {
            this.logger.debug(LOG_PREFIX + 'current latitude ', resPosition.coords.latitude);
            this.logger.debug(LOG_PREFIX + 'current longitude ', resPosition.coords.longitude);
          } else {
            this.logger.debug(LOG_PREFIX + 'current longitude ', resPosition.coords);
          }
          // add current position marker
          const latitude = resPosition.coords.latitude;
          const longitude = resPosition.coords.longitude;
          const here = L.marker([+latitude, +longitude], {
            title: 'here'
          }).addTo(this.map);
          here.bindPopup(`<b>Sei qui!</b><br><small>Lat: ${latitude}<br>Lon: ${longitude}</small>`).openPopup();
        }
      );
    }

  }

  ngAfterViewInit() {
    //add marker of positions on map
    this.positionsListSubscription = this.positionsList$.subscribe(
      (res)  => {
        if (res.length > 0) {
          setTimeout(() => {
            res.forEach( (position, i) => {
              const marker = L.marker([+position.coords.lat, +position.coords.lon], {
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

  ngOnDestroy(): void {
    if (this.currentCoordsSubscription) {
      this.currentCoordsSubscription.unsubscribe();
    }
    if (this.positionsListSubscription) {
      this.positionsListSubscription.unsubscribe();
    }

  }

  // #TODO: se sono in hover sulla posizione nella lista attiva marker sulla mappa
}
