import { PilotsComponent } from './../components/pilots/pilots.component';
import { ServicePriceComponent } from './../components/service-price/service-price.component';
import { Routes } from '@angular/router';
import { DraughtComponent } from '../components/draught/draught.component';
import { TideTableComponent } from '../components/specification/tide-table/tide-table.component';
import { PortWaterAreaComponent } from '../components/specification/port-water-area/port-water-area.component';
import { ThongTinTaiKhoanComponent } from '../components/thongtintaikhoan/thongtintaikhoan.component';
import { KehoachdantauComponent } from '../components/kehoachdantau/kehoachdantau.component';

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
  {
    path: 'news',
    loadChildren: () => import('../components/news/news.routers').then(m => m.NEWS_ROUTERS),
  },

  {
    path: 'about',
    loadChildren: () => import('../components/news/news.routers').then(m => m.NEWS_ROUTERS),
  },


  {
    path: 'monnuoc', component: DraughtComponent
  },
  {
    path: 'giadichvu', component: ServicePriceComponent
  },
  {
    path: 'hoatieu', component: PilotsComponent
  },

  {
    path: 'specification/hethongcangbien', component: PortWaterAreaComponent
  },

  {
    path: 'specification/tuyenluong', component: DraughtComponent
  },

  {
    path: 'specification/bangthuytrieu', component: TideTableComponent
  },

  {
    path: 'user', component: ThongTinTaiKhoanComponent
  },





  {
    path: 'specification',
    loadChildren: () => import('../components/specification/specification.routers').then(m => m.SPECIFICATION_ROUTERS),
  },


  {
    path: 'kehoachdantau', component: KehoachdantauComponent
  },

];