import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StadiumService {

  baseUrl = environment.apiUrl + 'stadiums/';

  constructor(
    private http: HttpClient
  ) { }

  createStadium(stadium: any) {
    return this.http.post(this.baseUrl, stadium);
  }

  getStadiumsManagedByYou() {
    return this.http.get(this.baseUrl + 'managed-by-you');
  }

}
