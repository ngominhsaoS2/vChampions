import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private cookieService: CookieService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headersConfig = {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    };

    const token = this.cookieService.get('token');
    if (token) {
      headersConfig['x-auth-token'] = token;
    }

    const nextReq = req.clone({ setHeaders: headersConfig });
    return next.handle(nextReq);
  }
}
