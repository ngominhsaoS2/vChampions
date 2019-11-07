import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { JwtHelperService } from '@auth0/angular-jwt';

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
            this.cookieService.set('token', res.token);
            this.decodedToken = this.jwtHelper.decodeToken(res.token);
          }
        })
      );
  }

  logout() {
    this.cookieService.delete('token');
    this.decodedToken = null;
  }

  loggedIn() {
    const token = this.cookieService.get('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  register(user: any) {
    return this.http.post(this.baseUrl + 'users', user);
  }

}
