import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
import { catchError, map, take, tap } from 'rxjs/operators';

const LOG_PREFIX = '[Earthquake-Service] ';

@Injectable({
  providedIn: 'root'
})
export class EarthquakeServiceService {

  data$: Observable<any>;

  constructor(
    private http: HttpClient,
    private logger: NGXLogger
  ) {

    // this.getEarthquake().subscribe(
    //   res => {
    //     this.logger.debug(LOG_PREFIX + 'getInfo results: ', res);
    //     this.data$ = of(res);
    //   }
    // );

   }

  getEarthquake() {
    return this.http.get('https://webservices.ingv.it/fdsnws/event/1/query',
    {responseType: 'text'}
    ).pipe(
      take(1), //così fa unsubscribe da solo dopo che prende primo value
      map(
         (res) => {
        this.logger.debug(LOG_PREFIX + 'getInfo received');
          // console.log('response',res);
          // console.log('response da ingv ottenuta come text');
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(res,'text/xml');
          const results = [];
          const x = Array.from(xmlDoc.getElementsByTagName('event'));
          x.forEach((element, idx) => {
            // console.log('Element number ' + (idx + 1), element);
            const publicID = element.getAttribute('publicID');
            const descriptionTag = element.getElementsByTagName('description')[0];
            const descriptionText = descriptionTag.getElementsByTagName('text')[0].childNodes[0].nodeValue;
            const magnitudeMainTag = element.getElementsByTagName('magnitude')[0];
            const magnitudeTag = magnitudeMainTag.getElementsByTagName('mag')[0];
            const magnitudeText = magnitudeTag.getElementsByTagName('value')[0].childNodes[0].nodeValue;
            const dateTag = element.getElementsByTagName('creationInfo')[0];
            const dateText = dateTag.getElementsByTagName('creationTime')[0].childNodes[0].nodeValue;
            //pusha info per ogni event
            results.push({
              id: idx,
              publicID,
              descriptionText,
              magnitudeText,
              dateText
            });
          });
          // console.log(results);
          // this.data$ = of(results);
          return results;

      }),
      catchError((err) => {
        this.logger.error(LOG_PREFIX + 'getInfo error: ', err);
        return null;
      })
    );
  }

}

export interface EarthquakeResponse {
  id: number;
  publicID: string;
  descriptionText: string;
  magnitudeText: string;
}
