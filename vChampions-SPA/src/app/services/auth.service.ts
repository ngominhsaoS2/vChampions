import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.apiUrl;
  jwtHelper = new JwtHelperService();
  decodedToken: any;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) { }

  login(model: any) {
    return this.http.post(this.baseUrl + 'auth', model)
      .pipe(
        map((res: any) => {
          if (res) {
            this.cookieService.set('token', res.token, null, '/');
            this.decodedToken = this.jwtHelper.decodeToken(res.token);
          }
        })
      );
  }

  logout() {
    this.cookieService.delete('token', '/');
    this.decodedToken = null;
  }

  loggedIn() {
    const token = this.cookieService.get('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  register(user: any) {
    return this.http.post(this.baseUrl + 'users', user);
  }

  hasRoles(requiredRoles: []) {
    if (this.loggedIn()) {
      let isMatch = false;
      const userRoles = this.decodedToken.roles as Array<string>;
      requiredRoles.forEach(role => {
        if (userRoles.includes(role)) {
          isMatch = true;
          return;
        }
      });

      return isMatch;
    }

    return false;
  }

}
