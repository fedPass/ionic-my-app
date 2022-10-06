import { Injectable, NgZone } from '@angular/core';
import { ConnectionStatus, Network } from '@capacitor/network';
import { NGXLogger } from 'ngx-logger';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { PluginListenerHandle } from '@capacitor/core';

const LOG_PREFIX = '[Network-Service] ';


@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  isNetworkAvaible: boolean;
  netStatus: ConnectionStatus;

  status$: Observable<ConnectionStatus>;
  listener: PluginListenerHandle;
  status = new BehaviorSubject<ConnectionStatus>(null);

  constructor(
    private logger: NGXLogger,
    private zone: NgZone, //per aggiornarsi in automatico
  ) {
    this.getNetworkStatus().then(
      (status) => {
        this.netStatus = status;
        this.status$ = of(status);
      }
    );

    this.listener = Network.addListener('networkStatusChange', (status) => {
      this.zone.run(() => {
        this.logger.debug(LOG_PREFIX + 'Network status changed', status);
        this.status.next(status);
        this.netStatus = status;
      });
    });
   }

  async getNetworkStatus(){
    const isConnected = (await Network.getStatus());
    this.logger.debug(LOG_PREFIX + 'Is network connected?', isConnected);
    this.isNetworkAvaible = isConnected.connected;
    return isConnected;
  }

  public getStatusObservable(): Observable<ConnectionStatus> {
   return this.status.asObservable();
 }

}
