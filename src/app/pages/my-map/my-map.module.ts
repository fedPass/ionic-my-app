import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyMapPageRoutingModule } from './my-map-routing.module';

import { MyMapPage } from './my-map.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyMapPageRoutingModule,
    ComponentsModule
  ],
  declarations: [MyMapPage]
})
export class MyMapPageModule {}
