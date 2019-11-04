// Libarary Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDropdownModule, CarouselModule, AlertModule, ModalModule } from 'ngx-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtModule } from '@auth0/angular-jwt';
import { ToastrModule } from 'ngx-toastr';

// Customized Modules
import { appRoutes } from './routes';

// Libarary Services
import { CookieService } from 'ngx-cookie-service';

// Customized Guards
import { AuthGuard } from './guards/auth.guard';

// Customized Services
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';

// Customized Resolvers

// Components
import { AppComponent } from './app.component';
import { NavComponent } from './components/nav/nav.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { CarouselSmComponent } from './components/carousel/carousel-sm/carousel-sm.component';
import { CarouselMdComponent } from './components/carousel/carousel-md/carousel-md.component';
import { LoginComponent } from './components/login/login.component';
import { FollowUsComponent } from './components/addition/follow-us/follow-us.component';
import { ClubCreateComponent } from './components/clubs/club-create/club-create.component';
import { RankSmComponent } from './components/addition/rank-sm/rank-sm.component';
import { FindPlayersComponent } from './components/clubs/find-players/find-players.component';

// 2019/10/28 SaoNM custom tokenGetter
export function tokenGetter() {
  const value = '; ' + document.cookie;
  const parts = value.split('; ' + 'token' + '=');

  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }

  return null;
}

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    RegisterComponent,
    HomeComponent,
    CarouselSmComponent,
    CarouselMdComponent,
    LoginComponent,
    FollowUsComponent,
    RankSmComponent,
    ClubCreateComponent,
    FindPlayersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
    CarouselModule.forRoot(),
    ModalModule.forRoot(),
    AlertModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    NgxSpinnerModule,
    ToastrModule.forRoot({
      newestOnTop: false,
      timeOut: 5000,
      closeButton: true,
      positionClass: 'toast-bottom-left',
      progressBar: true,
      progressAnimation: 'decreasing'
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:3000'],
        blacklistedRoutes: ['localhost:3000/api/auth']
      }
    }),
  ],
  providers: [
    CookieService,
    AuthService,
    UserService,
    AuthGuard
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
