import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = environment.apiUrl + 'users';

  constructor(
    private http: HttpClient,
  ) { }

  findPlayers(criteria: any) {
    return this.http.post(this.baseUrl + '/find-players', criteria);
  }

}
