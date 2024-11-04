import { Routes } from '@angular/router';
import { LayoutAdminComponent } from './shared/layout-admin/layout-admin.component';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './components/auth/login/login.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: '',
    component: LayoutAdminComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./shared/shared.routers').then(m => m.SHARED_ROUTERS),
      }
    ]
  },
  {
    path: 'login', component: LoginComponent
  },
  { path: '**', redirectTo: 'login' }
];
