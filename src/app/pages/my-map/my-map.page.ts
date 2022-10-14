import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import 'leaflet';
// import {L} from 'leaflet';
import 'leaflet-routing-machine';
import { DataFireService, Position } from 'src/app/services/data-fire.service';
import { Observable, of, Subscription, } from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import { isPlatform } from '@ionic/angular';
import { CurrentPosition, GeolocationService } from 'src/app/services/geolocation.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

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
  currentCoordsSubscription: Subscription;
  positionsListSubscription: Subscription;
  receivedPosition: Position;
  selectedPositionSub: Subscription;

  allSubscriptions: Subscription;
  currentCoords: CurrentPosition | any;

  constructor(
    private dataFire: DataFireService,
    private logger: NGXLogger,
    private geoservice: GeolocationService
  ) {
    this.positionsList$ = this.dataFire.userPositions$;

    this.selectedPositionSub = this.geoservice.selectedPosition$.subscribe(
      (res) => {
        if(res) {
          this.receivedPosition = res;
        }
      }
    );
    this.selectedPositionSub.add(this.allSubscriptions);
    this.logger.debug(LOG_PREFIX + 'Received position: ', this.receivedPosition);
  }

  async ngOnInit() {
    this.currentCoordsSubscription = this.geoservice.getCurrentPosition()
    .subscribe(
      (currentCoords) => {
        const currentLat = +currentCoords.coords.latitude;
        const currentLon = +currentCoords.coords.longitude;
        // this.logger.debug(LOG_PREFIX + 'getCurrentPosition ', this.currentCoords);
        this.map = new L.Map('map');
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
        if ((this.receivedPosition)
          && ((currentLat !== +this.receivedPosition.coords.lat) && (currentLon !== +this.receivedPosition.coords.lon))
        )
         {
          //create map with received coords
          if (isPlatform('mobile')) {
            this.logger.debug(LOG_PREFIX + 'received position ', this.receivedPosition.name);
          } else {
            this.logger.debug(LOG_PREFIX + 'received position ', this.receivedPosition);
          }
          //traccia percorso da posizione corrente a punto ricevuto
          L.Routing.control({
            waypoints: [
              L.latLng(currentLat, currentLon),
              L.latLng(+this.receivedPosition.coords.lat, +this.receivedPosition.coords.lon)
            ],
            routeWhileDragging: true,
            autoRoute: true,
            showAlternatives: true,
            show: false
            //router: new L.Routing.OSRMv1({ serviceUrl: mapConfigs.osrmUrl }), //per la versione prod ci vorrebbe un serviceUrl
          }).addTo(this.map);
          this.map.setView([currentLat, currentLat],10);
        } else {
          if (isPlatform('mobile')) {
            this.logger.debug(LOG_PREFIX + 'current latitude ', currentLat);
            this.logger.debug(LOG_PREFIX + 'current longitude ', currentLon);
          } else {
            this.logger.debug(LOG_PREFIX + 'current coords: ', currentCoords.coords);
          }
          // add current position marker
          this.map.setView([currentLat, currentLon],5);
          const here = L.marker([currentLat, currentLon], {
            title: 'here'
          }).addTo(this.map);
          here.bindPopup(`<b>Sei qui!</b><br><small>Lat: ${currentLat}<br>Lon: ${currentLon}</small>`).openPopup();
        }
      },
      error => {
        this.logger.error(LOG_PREFIX + 'getCurrentPosition failed', error);
      },
    );
    this.currentCoordsSubscription.add(this.allSubscriptions);
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
              }
            });
          }, 300);
          if (!isPlatform('mobile')) {
            this.logger.debug(LOG_PREFIX + ' positions: ', res);
          }
        }
    });
    this.positionsListSubscription.add(this.allSubscriptions);
  }

  ngOnDestroy(): void {
    if(this.allSubscriptions) {
      this.allSubscriptions.unsubscribe();
    }

  }

  // #TODO: se sono in hover sulla posizione nella lista attiva marker sulla mappa
}
