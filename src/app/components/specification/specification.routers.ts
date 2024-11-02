import { PortWaterAreaComponent } from './port-water-area/port-water-area.component';
import { Routes } from '@angular/router';
import { TideTableComponent } from './tide-table/tide-table.component';



export const SPECIFICATION_ROUTERS: Routes = [
  {
    path: 'vungnuoc', component: PortWaterAreaComponent
  },
  {
    path: 'thuytrieu', component: TideTableComponent
  },
];