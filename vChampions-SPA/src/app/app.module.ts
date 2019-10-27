// Built-in modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDropdownModule, CarouselModule  } from 'ngx-bootstrap';
import { RouterModule } from '@angular/router';

// Customized modules
import { appRoutes } from './routes';

// Components
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { CarouselSmComponent } from './carousel/carousel-sm/carousel-sm.component';
import { CarouselMdComponent } from './carousel/carousel-md/carousel-md.component';
import { LoginComponent } from './login/login.component';
import { FollowUsComponent } from './addition/follow-us/follow-us.component';

@NgModule({
   declarations: [
      AppComponent,
      NavComponent,
      RegisterComponent,
      HomeComponent,
      CarouselSmComponent,
      CarouselMdComponent,
      LoginComponent,
      FollowUsComponent
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      HttpClientModule,
      BrowserAnimationsModule,
      BsDropdownModule.forRoot(),
      CarouselModule.forRoot(),
      RouterModule.forRoot(appRoutes)
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
