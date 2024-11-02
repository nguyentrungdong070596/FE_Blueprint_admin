import { Routes } from '@angular/router';

export const SHARED_ROUTERS: Routes = [
  {
    path: '',
    loadChildren: () => import('../components/home/home.routers').then(m => m.HOME_ROUTERS),
  },
  {
    path: 'home',
    loadChildren: () => import('../components/home/home.routers').then(m => m.HOME_ROUTERS),
  },
  {
    path: 'introduction',
    loadChildren: () => import('../components/introduction/introduction.routers').then(m => m.INTRODUCTION_ROUTERS),
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