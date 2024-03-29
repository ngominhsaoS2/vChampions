import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

// Resolvers
import { ClubManageResolver } from './resolvers/club-manage.resolver';
import { ClubViewResolver } from './resolvers/club-view.resolver';
import { LoggedInUserResolver } from './resolvers/logged-in-user.resolver';
import { StadiumResolver } from './resolvers/stadium.resolver';

// Components
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ClubCreateComponent } from './components/clubs/club-create/club-create.component';
import { ClubListComponent } from './components/clubs/club-list/club-list.component';
import { ClubViewComponent } from './components/clubs/club-view/club-view.component';
import { ClubManageComponent } from './components/clubs/club-manage/club-manage.component';
import { PlayerListComponent } from './components/players/player-list/player-list.component';
import { ProfilePlayerComponent } from './components/profile/profile-player/profile-player.component';
import { ProfileOwnerComponent } from './components/profile/profile-owner/profile-owner.component';
import { ClubEditComponent } from './components/clubs/club-edit/club-edit.component';
import { StadiumCreateComponent } from './components/stadiums/stadium-create/stadium-create.component';
import { StadiumManageComponent } from './components/stadiums/stadium-manage/stadium-manage.component';
import { StadiumEditComponent } from './components/stadiums/stadium-edit/stadium-edit.component';
import { RoleGuard } from './guards/role.guard';


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
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Player'] },
    children: [
      { path: 'club/create', component: ClubCreateComponent },
      { path: 'club/manage-list', component: ClubListComponent },
      { path: 'club/manage/:clubCode', component: ClubManageComponent, resolve: { club: ClubManageResolver } },
      { path: 'club/view/:clubCode', component: ClubViewComponent, resolve: { club: ClubViewResolver } },
      { path: 'club/edit/:clubCode', component: ClubEditComponent, resolve: { club: ClubManageResolver } },
    ]
  },

  // Stadiums
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['StadiumOwner'] },
    children: [
      { path: 'stadium/create', component: StadiumCreateComponent },
      { path: 'stadium/edit/:id', component: StadiumEditComponent, resolve: { stadium: StadiumResolver } },
      { path: 'stadium/manage/:id', component: StadiumManageComponent, resolve: { stadium: StadiumResolver } },
    ]
  },

  // Players
  { path: 'players', component: PlayerListComponent },

  // Profile
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['StadiumOwner'] },
    children: [
      { path: 'profile/StadiumOwner', component: ProfileOwnerComponent, resolve: { owner: LoggedInUserResolver } },
    ]
  },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Player'] },
    children: [
      { path: 'profile/Player', component: ProfilePlayerComponent, resolve: { player: LoggedInUserResolver } }
    ]
  },

  // Others
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];
