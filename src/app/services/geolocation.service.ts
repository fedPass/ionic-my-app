import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { NGXLogger } from 'ngx-logger';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { Coords, Position } from './data-fire.service';

const LOG_PREFIX = '[Geolocation-Service] ';


@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  // currentPosition$: Observable<CurrentPosition>;

  selectedPositionSub = new BehaviorSubject<Position>(null);

  // currentPositionSubject = new BehaviorSubject<CurrentPosition>(null);


  constructor(
    private logger: NGXLogger
   ) {
    // this.getCurrentPosition();
   }

  //  async getCurrentPosition(){
  //   let currentCoords;
  //   await Geolocation.getCurrentPosition().then(
  //     (res) => {
  //       currentCoords = {
  //         coords: {
  //           lat: res.coords.latitude.toString(),
  //           lon: res.coords.longitude.toString(),
  //           alt: res.coords.altitude ? res.coords.altitude.toString() : null
  //         }
  //       };
  //     }
  //     );
  //     this.currentPositionSubject.next(currentCoords);
  //     this.logger.debug(LOG_PREFIX + 'Current Position', currentCoords);
  //     return currentCoords;
  //  }


   onSelectedPosition(position: Position){
    this.selectedPositionSub.next(position);
    this.logger.debug(LOG_PREFIX + 'Selected position: ', position);
   }

}

export interface CurrentPosition {
  coords: Coords;
}
