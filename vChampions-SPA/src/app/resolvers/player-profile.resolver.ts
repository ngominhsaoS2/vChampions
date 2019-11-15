import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class PlayerProfileResolver implements Resolve<any> {
  constructor(
    private router: Router,
    private userService: UserService,
    private toastr: ToastrService
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.userService.getLoggedInUser().pipe(
      catchError(error => {
        this.toastr.error(error.error, 'Error');
        return of(null);
      })
    );
  }

}
