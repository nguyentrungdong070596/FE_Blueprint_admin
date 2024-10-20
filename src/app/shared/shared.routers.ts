import { Routes } from '@angular/router';
import { InfoComponent } from '../components/info/info.component';
import { ListServicesComponent } from '../components/list-services/list-services.component';
import { NewsListComponent } from '../components/news-list/news-list.component';
import { MonnuocComponent } from '../components/monnuoc/monnuoc.component';
import { ServicesComponent } from '../components/services/services.component';
import { PilotComponent } from '../components/pilot/pilot.component';
import { VehicleComponent } from '../components/vehicle/vehicle.component';
import { TideComponent } from '../components/tide/tide.component';
import { CarouselComponent } from '../components/carousel/carousel.component';

export const SHARED_ROUTERS: Routes = [
  {
    path: '', component: InfoComponent
  },
  {
    path: 'info', component: InfoComponent
  },
  {
    path: 'carousel', component: CarouselComponent
  },
  {
    path: 'list-services', component: ListServicesComponent
  },
  {
    path: 'news', component: NewsListComponent
  },
  {
    path: 'monnuoc', component: MonnuocComponent
  },
  {
    path: 'services', component: ServicesComponent
  },
  {
    path: 'pilot', component: PilotComponent
  },
  {
    path: 'vehicle', component: VehicleComponent
  },
  {
    path: 'tide', component: TideComponent
  },

];