// Libarary Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDropdownModule, CarouselModule, AlertModule } from 'ngx-bootstrap';
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
import { AuthGuard } from './_guards/auth.guard';

// Customized Services
import { AuthService } from './_services/auth.service';

// Customized Resolvers

// Components
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { CarouselSmComponent } from './carousel/carousel-sm/carousel-sm.component';
import { CarouselMdComponent } from './carousel/carousel-md/carousel-md.component';
import { LoginComponent } from './login/login.component';
import { FollowUsComponent } from './addition/follow-us/follow-us.component';
import { ClubCreateComponent } from './clubs/club-create/club-create.component';

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
    ClubCreateComponent
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
    AuthGuard
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
