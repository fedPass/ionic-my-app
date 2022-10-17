import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EarthquakeListPageRoutingModule } from './earthquake-list-routing.module';

import { EarthquakeListPage } from './earthquake-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EarthquakeListPageRoutingModule
  ],
  declarations: [EarthquakeListPage]
})
export class EarthquakeListPageModule {}
