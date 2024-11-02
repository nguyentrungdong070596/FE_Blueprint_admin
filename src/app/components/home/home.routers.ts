import { ServicesComponent } from './services/services.component';
import { Routes } from '@angular/router';
import { CarouselComponent } from './carousel/carousel.component';
import { NewsComponent } from './news/news.component';


export const HOME_ROUTERS: Routes = [
  {
    path: 'banner', component: CarouselComponent
  },
  {
    path: 'services', component: ServicesComponent
  },
  {
    path: 'news', component: NewsComponent
  },
];