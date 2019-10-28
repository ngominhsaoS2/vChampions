import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ResultsComponent } from './results/results.component';
import { PlayersComponent } from './players/players.component';
import { RankComponent } from './rank/rank.component';
import { AuthGuard } from './_guards/auth.guard';
import { ProfileComponent } from './profile/profile.component';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'results', component: ResultsComponent },
  { path: 'players', component: PlayersComponent },
  { path: 'rank', component: RankComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { path: 'profile', component: ProfileComponent },
    ]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
