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
import { ClubViewResolver } from './resolvers/club-view.resolver';
import { PlayerListComponent } from './components/players/player-list/player-list.component';
import { PlayerProfileComponent } from './components/profile/player-profile/player-profile.component';
import { StadiumOwnerProfileComponent } from './components/profile/stadium-owner-profile/stadium-owner-profile.component';
import { PlayerProfileResolver } from './resolvers/player-profile.resolver';

export const appRoutes: Routes = [
  // Home, Register, Login, Logout ...
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
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
      { path: 'club/view/:clubCode', component: ClubViewComponent, resolve: { club: ClubViewResolver } },
    ]
  },
  { path: 'club/view/:clubCode', component: ClubViewComponent },

  // Players
  { path: 'players', component: PlayerListComponent },

  // Profile
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { path: 'profile/Player', component: PlayerProfileComponent, resolve: { player: PlayerProfileResolver } },
      { path: 'profile/StadiumOwner', component: StadiumOwnerProfileComponent },
    ]
  },

  // Others
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];
