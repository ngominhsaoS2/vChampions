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

  getStadiumsManagedByYou() {
    return this.http.get(this.baseUrl + 'managed-by-you');
  }

  getStadiumManageView(id) {
    return this.http.get(this.baseUrl + 'manage/' + id);
  }

  createStadium(stadium: any) {
    return this.http.post(this.baseUrl, stadium);
  }

  editStadium(stadium: any) {
    return this.http.put(this.baseUrl + stadium._id, stadium);
  }

  addPrice(prices: any, stadiumId: string) {
    return this.http.put(this.baseUrl + stadiumId + '/add-prices', prices);
  }

}
