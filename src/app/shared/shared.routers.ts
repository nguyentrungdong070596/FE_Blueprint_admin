import { ServicePriceComponent } from './../components/service-price/service-price.component';
import { Routes } from '@angular/router';
import { DraughtComponent } from '../components/draught/draught.component';

export const SHARED_ROUTERS: Routes = [
  {
    path: 'home',
    loadChildren: () => import('../components/home/home.routers').then(m => m.HOME_ROUTERS),
  },
  {
    path: 'introduction',
    loadChildren: () => import('../components/introduction/introduction.routers').then(m => m.INTRODUCTION_ROUTERS),
  },
  {
    path: 'news',
    loadChildren: () => import('../components/news/news.routers').then(m => m.NEWS_ROUTERS),
  },
  {
    path: 'monnuoc', component: DraughtComponent
  },
  {
    path: 'giadichvu', component: ServicePriceComponent
  },
  {
    path: 'hoatieu', component: DraughtComponent
  },
  // {
  //   path: 'list-services', component: ListServicesComponent
  // },
  // {
  //   path: 'news', component: NewsListComponent
  // },
  // {
  //   path: 'monnuoc', component: MonnuocComponent
  // },
  // {
  //   path: 'services', component: ServicesComponent
  // },
  // {
  //   path: 'pilot', component: PilotComponent
  // },
  // {
  //   path: 'vehicle', component: VehicleComponent
  // },
  // {
  //   path: 'tide', component: TideComponent
  // },

];