import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { StadiumService } from '../services/stadium.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class StadiumResolver implements Resolve<any> {
  constructor(
    private router: Router,
    private stadiumService: StadiumService,
    private toastr: ToastrService
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.stadiumService.getStadiumManageView(route.params.id).pipe(
      catchError(error => {
        this.toastr.error(error.error, 'Error');
        this.router.navigate(['/profile/StadiumOwner']);
        return of(null);
      })
    );
  }

}
