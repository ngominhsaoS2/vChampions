import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'vChampions-SPA';
  jwtHelper = new JwtHelperService();

  constructor(
    private cookieService: CookieService,
    public authService: AuthService
  ) { }

  ngOnInit() {
    const token = this.cookieService.get('token');
    if (token) {
      this.authService.decodedToken = this.jwtHelper.decodeToken(token);
    } else {
      this.cookieService.delete('token');
    }
  }

}
