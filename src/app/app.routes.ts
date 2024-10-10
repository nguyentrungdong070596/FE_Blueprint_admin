import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { LayoutAdminComponent } from './components/layout-admin/layout-admin.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddDashboardComponent } from './components/dashboard/add-dashboard/add-dashboard.component';
import { ListServicesComponent } from './components/list-services/list-services.component';
import { AddListServicesComponent } from './components/list-services/add-list-services/add-list-services.component';
import { NewsListComponent } from './components/news-list/news-list.component';
import { AddNewComponent } from './components/news-list/add-new/add-new.component';
import { MonnuocComponent } from './components/monnuoc/monnuoc.component';  
import { AddMonnuocComponent } from './components/monnuoc/add-monnuoc/add-monnuoc.component';
import { ServicesComponent } from './components/services/services.component';
import { AddServicesComponent } from './components/services/add-services/add-services.component';
import { PilotComponent } from './components/pilot/pilot.component';
import { AddPilotComponent } from './components/pilot/add-pilot/add-pilot.component';
import { VehicleComponent } from './components/vehicle/vehicle.component';
import { AddVehicleComponent } from './components/vehicle/add-vehicle/add-vehicle.component';
import { TideComponent } from './components/tide/tide.component';
import { AddTideComponent } from './components/tide/add-tide/add-tide.component';
import { AuthGuard } from './auth.guard'; // Nhập guard vào đây

export const routes: Routes = [
  { path: 'auth', 
    children: [
        { path: 'login', component: LoginComponent },
        { path: 'register', component: RegisterComponent }
    ]
  },
  { path: '', 
    component: LayoutAdminComponent,
    canActivate: [AuthGuard], // Áp dụng AuthGuard
    children: [
        { path: 'dashboard', component: DashboardComponent },
        {path: 'dashboard/add', component:AddDashboardComponent},
        { path: 'list-services', component: ListServicesComponent },
        { path: 'list-services/add', component: AddListServicesComponent },
        { path: 'news', component: NewsListComponent },
        { path: 'news/add', component: AddNewComponent },  
        { path: 'monnuoc', component: MonnuocComponent }, 
        { path: 'monnuoc/add', component: AddMonnuocComponent }, 
        { path: 'services', component: ServicesComponent },
        { path: 'services/add', component: AddServicesComponent },
        { path: 'pilot', component: PilotComponent },
        { path: 'pilot/add', component: AddPilotComponent },
        { path: 'vehicle', component: VehicleComponent },
        { path: 'vehicle/add', component: AddVehicleComponent },
        { path: 'tide', component: TideComponent },
        { path: 'tide/add', component: AddTideComponent },
        { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '/auth/login' } // Chuyển hướng về trang đăng nhập nếu không tìm thấy đường dẫn
];
