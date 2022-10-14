import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import { NGXLogger } from 'ngx-logger';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { map, shareReplay, tap } from 'rxjs/operators';
import { Coords, Position } from './data-fire.service';

const LOG_PREFIX = '[Geolocation-Service] ';


@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  selectedPosition$: Observable<Position>;
  selectedPositionSub = new BehaviorSubject<Position>(null);

  // currentPosition$: Observable<CurrentPosition>;
  // currentPositionSubject = new BehaviorSubject<CurrentPosition>(null);

  constructor(
    private logger: NGXLogger,
    private router: Router
   ) {
    this.selectedPosition$ = this.selectedPositionSub.asObservable();

    // this.getCurrentPosition().subscribe(
    //   (res) => {
    //     const currPos = {
    //       coords: {
    //         lat: res.coords.latitude.toString(),
    //         lon: res.coords.longitude.toString(),
    //         alt: res.coords.altitude ? res.coords.altitude.toString() : null
    //       }
    //     };
    //     this.currentPositionSubject.next(currPos);
    //     this.currentPosition$ = this.currentPositionSubject.asObservable();
    //     this.logger.debug(LOG_PREFIX + 'Current Position inside subscribe: ', this.currentPositionSubject.getValue());

    //   }
    //   );
    //   this.logger.debug(LOG_PREFIX + 'Current Position out subscribe : ', this.currentPositionSubject.getValue());

   }

   getCurrentPosition() {
    return fromPromise(Geolocation.getCurrentPosition());
   }

   onSelectedPosition(position: Position){
    this.selectedPositionSub.next(position);
    this.selectedPosition$ = this.selectedPositionSub.asObservable();
    this.logger.debug(LOG_PREFIX + 'Selected position: ', position);
    //TODO: su my-map se clicco per la prima volta/o clicco un posto diverso non viene mostrato nuovo percorso
    //per aggiornare devo richiamare funzione per calcolare percorso
    // this.logger.debug(LOG_PREFIX + 'Sto su: ', this.router.url);
   }

}

export interface CurrentPosition {
  coords: Coords;
}
