import { Routes } from '@angular/router';
import { OpenletterComponent } from './openletter/openletter.component';
import { FunctiontaskComponent } from './functiontask/functiontask.component';
import { LeadershipComponent } from './leadership/leadership.component';
import { OrganizationalComponent } from './organizational/organizational.component';
import { HistoryComponent } from './history/history.component';


export const INTRODUCTION_ROUTERS: Routes = [
  {
    path: 'thungo', component: OpenletterComponent
  },
  {
    path: 'chucnang', component: FunctiontaskComponent
  },
  {
    path: 'lanhdao', component: LeadershipComponent
  },
  {
    path: 'danhsachphuongtien', component: OrganizationalComponent
  },
  {
    path: 'luocsu', component: HistoryComponent
  },
];