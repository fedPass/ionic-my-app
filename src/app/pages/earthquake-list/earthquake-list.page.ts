import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { EarthquakeServiceService } from 'src/app/services/earthquake-service.service';

@Component({
  selector: 'app-earthquake-list',
  templateUrl: './earthquake-list.page.html',
  styleUrls: ['./earthquake-list.page.scss'],
})
export class EarthquakeListPage implements OnInit, OnDestroy {

  earthquakeSub: Subscription;
  earthquakeList$: Observable<any>;

  constructor(
    private earthquake: EarthquakeServiceService
  ) { }

  ngOnInit() {
    this.earthquakeSub = this.earthquake.getEarthquake().subscribe(
      (eventList) => {this.earthquakeList$ = of(eventList);}
    );
  }

  ngOnDestroy(): void {
    this.earthquakeSub.unsubscribe();
  }

}
