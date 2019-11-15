import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl + 'users/';

  constructor(
    private http: HttpClient,
  ) { }

  findPlayers(criteria: any, pageSize: number, page: number) {
    return this.http.post(this.baseUrl + 'find-players/pageSize/' + pageSize + '/page/' + page, criteria);
  }

  getLoggedInUser() {
    return this.http.get(this.baseUrl + 'me');
  }

  confirmInvitation(clubId, confirmation) {
    return this.http.put(this.baseUrl + 'confirm-invitation/' + clubId, confirmation);
  }

}
