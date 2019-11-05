import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { ClubCreateComponent } from './components/clubs/club-create/club-create.component';
import { ClubManageComponent } from './components/clubs/club-manage/club-manage.component';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { path: 'club/create', component: ClubCreateComponent },
      { path: 'club/manage', component: ClubManageComponent },
    ]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
