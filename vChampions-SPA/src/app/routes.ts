import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ClubCreateComponent } from './components/clubs/club-create/club-create.component';
import { ClubListComponent } from './components/clubs/club-list/club-list.component';
import { ClubViewComponent } from './components/clubs/club-view/club-view.component';
import { ClubManageComponent } from './components/clubs/club-manage/club-manage.component';
import { ClubManageResolver } from './resolvers/club-manage.resolver';

export const appRoutes: Routes = [
  // Home, Register, Login, Logout ...
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },

  // Clubs
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { path: 'club/create', component: ClubCreateComponent },
      { path: 'club/manage-list', component: ClubListComponent },
      { path: 'club/manage/:clubCode', component: ClubManageComponent, resolve: { club: ClubManageResolver } },
    ]
  },
  { path: 'club/view/:clubCode', component: ClubViewComponent },

  // Others
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
