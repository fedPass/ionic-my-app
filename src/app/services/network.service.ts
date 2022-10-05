import { Injectable } from '@angular/core';
import { ConnectionStatus, Network } from '@capacitor/network';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';

const LOG_PREFIX = '[Network-Service] ';


@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  isNetworkAvaible: boolean;
  networkListener: Observable<any>;

  constructor(
    private logger: NGXLogger
  ) {
    this.networkListener = fromPromise(this.listenerNetworkStatus());
   }

  async listenerNetworkStatus() {
    Network.addListener('networkStatusChange', status => {
      this.isNetworkAvaible = status.connected;
      this.logger.debug(LOG_PREFIX + 'Network status changed', status);
      this.logger.debug(LOG_PREFIX + 'New Network status ', this.isNetworkAvaible);
      // window.location.reload(); //soluzione non bella
      return status.connected;
    });
  }

  async isConnectedCheck(){
    const isConnected = (await Network.getStatus()).connected;
    this.logger.debug(LOG_PREFIX + 'Is network connected?', isConnected);
    this.isNetworkAvaible = isConnected;
    return isConnected;
  }

  async isConnectedCheck2() {
    return (await Network.getStatus()).connected;
  }

}
