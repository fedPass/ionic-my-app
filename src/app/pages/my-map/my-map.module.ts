import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyMapPageRoutingModule } from './my-map-routing.module';

import { MyMapPage } from './my-map.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyMapPageRoutingModule
  ],
  declarations: [MyMapPage]
})
export class MyMapPageModule {}
