import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PositionsCardComponent } from './positions-card/positions-card.component';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { RouteReuseStrategy } from '@angular/router';
import {RouterModule} from '@angular/router';




@NgModule({
  declarations: [
    PositionsCardComponent
  ],
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    RouterModule
  ],
  exports: [
    PositionsCardComponent
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
})
export class ComponentsModule { }
