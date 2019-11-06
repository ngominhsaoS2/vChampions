import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  model: any = {};
  showError = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private cookieService: CookieService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {

  }

  login() {
    this.spinner.show();
    this.authService.login(this.model).subscribe(next => {
      this.spinner.hide();
      this.router.navigate(['/']);
      this.toastr.success('Login successfully', 'Success');
    }, error => {
      this.showError = true;
      this.spinner.hide();
      console.log(error);
    });
  }



}
