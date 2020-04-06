import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  jwtHelper = new JwtHelperService();

  constructor(
    private router: Router,
    private cookieService: CookieService,
    public authService: AuthService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
  }

  loggedIn() {
    return this.authService.loggedIn();
  }

  hasRoles(requiredRoles: any) {
    return this.authService.hasRoles(requiredRoles);
  }

  logout() {
    this.authService.logout();
    this.toastr.info('Logout successfully', 'Info');
    this.router.navigate(['/']);
  }

}
