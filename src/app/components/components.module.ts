import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PositionsCardComponent } from './positions-card/positions-card.component';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { RouteReuseStrategy } from '@angular/router';
// import { AppRoutingModule } from '../app-routing.module';




@NgModule({
  declarations: [
    PositionsCardComponent
  ],
  imports: [
    // AppRoutingModule,
    CommonModule,
    IonicModule.forRoot(),
  ],
  exports: [
    PositionsCardComponent
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
})
export class ComponentsModule { }
