import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LogonComponent } from './logon/logon.component';

export const AUTH_ROUTERS: Routes = [
  {
    path: 'register', component: RegisterComponent
  },
  {
    path: 'login', component: LogonComponent
  }
];
