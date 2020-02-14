// Libarary Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDropdownModule, CarouselModule, AlertModule, ModalModule, TabsModule, TooltipModule, PaginationModule } from 'ngx-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { FileUploadModule } from 'ng2-file-upload';

// Customized Modules
import { appRoutes } from './routes';

// Libarary Services
import { CookieService } from 'ngx-cookie-service';

// Customized Guards
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

// Customized Services
import { TokenInterceptor } from './services/token-interceptor';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { ImageService } from './services/image.service';
import { StadiumService } from './services/stadium.service';

// Customized Resolvers
import { ClubManageResolver } from './resolvers/club-manage.resolver';
import { ClubViewResolver } from './resolvers/club-view.resolver';
import { LoggedInUserResolver } from './resolvers/logged-in-user.resolver';
import { StadiumResolver } from './resolvers/stadium.resolver';

// Customized Directives


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
import { ClubListComponent } from './components/clubs/club-list/club-list.component';
import { ClubViewComponent } from './components/clubs/club-view/club-view.component';
import { ClubManageComponent } from './components/clubs/club-manage/club-manage.component';
import { PlayerListComponent } from './components/players/player-list/player-list.component';
import { TopPlayersSmComponent } from './components/addition/top-players-sm/top-players-sm.component';
import { ProfilePlayerComponent } from './components/profile/profile-player/profile-player.component';
import { ProfileOwnerComponent } from './components/profile/profile-owner/profile-owner.component';
import { InformationComponent } from './components/profile/information/information.component';
import { ClubsOfPlayerComponent } from './components/profile/clubs-of-player/clubs-of-player.component';
import { ClubEditComponent } from './components/clubs/club-edit/club-edit.component';
import { StadiumCreateComponent } from './components/stadiums/stadium-create/stadium-create.component';
import { StadiumEditComponent } from './components/stadiums/stadium-edit/stadium-edit.component';
import { StadiumsOfOwnerComponent } from './components/profile/stadiums-of-owner/stadiums-of-owner.component';
import { StadiumManageComponent } from './components/stadiums/stadium-manage/stadium-manage.component';
import { PriceCreateEditComponent } from './components/stadiums/price-create-edit/price-create-edit.component';

@NgModule({
  declarations: [
    // Directives

    // Components
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
    ClubEditComponent,
    ClubListComponent,
    ClubViewComponent,
    ClubManageComponent,
    FindPlayersComponent,
    PlayerListComponent,
    TopPlayersSmComponent,
    ProfilePlayerComponent,
    ProfileOwnerComponent,
    InformationComponent,
    ClubsOfPlayerComponent,
    StadiumCreateComponent,
    StadiumEditComponent,
    StadiumsOfOwnerComponent,
    StadiumManageComponent,
    PriceCreateEditComponent
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
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    PaginationModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    NgxSpinnerModule,
    SweetAlert2Module.forRoot(),
    FileUploadModule,
    ToastrModule.forRoot({
      newestOnTop: false,
      timeOut: 5000,
      closeButton: true,
      positionClass: 'toast-bottom-left',
      progressBar: false,
      progressAnimation: 'decreasing'
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    // Services
    CookieService,
    AuthService,
    UserService,
    ImageService,
    StadiumService,
    // Resolver
    ClubManageResolver,
    ClubViewResolver,
    LoggedInUserResolver,
    StadiumResolver,
    // Guards
    AuthGuard,
    RoleGuard
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
