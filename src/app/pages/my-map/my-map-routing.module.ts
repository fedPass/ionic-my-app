import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyMapPage } from './my-map.page';

const routes: Routes = [
  {
    path: '',
    component: MyMapPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyMapPageRoutingModule {}
