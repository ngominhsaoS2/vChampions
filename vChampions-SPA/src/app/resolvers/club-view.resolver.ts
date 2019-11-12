import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ClubService } from '../services/club.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ClubViewResolver implements Resolve<any> {
  constructor(
    private router: Router,
    private clubService: ClubService,
    private toastr: ToastrService
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.clubService.getClubInViewMode(route.params.clubCode).pipe(
      catchError(error => {
        this.toastr.error(error.error, 'Error');
        return of(null);
      })
    );
  }

}
