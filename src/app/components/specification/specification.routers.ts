import { PortWaterAreaComponent } from './port-water-area/port-water-area.component';
import { Routes } from '@angular/router';
import { TideTableComponent } from './tide-table/tide-table.component';
import { DraughtComponent } from '../draught/draught.component';



export const SPECIFICATION_ROUTERS: Routes = [
  {
    path: 'hethongcangbien', component: PortWaterAreaComponent
  },
  {
    path: 'thuytrieu', component: TideTableComponent
  },
  {
    path: 'tuyenluong', component: DraughtComponent
  },

];