import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EarthquakeListPage } from './earthquake-list.page';

const routes: Routes = [
  {
    path: '',
    component: EarthquakeListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EarthquakeListPageRoutingModule {}
