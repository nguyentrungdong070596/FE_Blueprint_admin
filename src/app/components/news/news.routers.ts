import { Routes } from '@angular/router';
import { NewsSummaryComponent } from './news-summary/news-summary.component';
import { NotificationComponent } from './notification/notification.component';
import { ExecutiveTextComponent } from './executive-text/executive-text.component';
import { ReferencePostComponent } from './reference-post/reference-post.component';


export const NEWS_ROUTERS: Routes = [
  {
    path: 'tintonghop', component: NewsSummaryComponent
  },
  {
    path: 'thongbao', component: NotificationComponent
  },
  {
    path: 'vanban', component: ExecutiveTextComponent
  },
  {
    path: 'baiviet', component: ReferencePostComponent
  },
];