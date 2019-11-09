import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClubService {
  baseUrl = environment.apiUrl + 'clubs/';

  constructor(
    private http: HttpClient,
  ) { }

  createClub(club: any) {
    return this.http.post(this.baseUrl, club);
  }

  getClubsManagedByYou() {
    return this.http.get(this.baseUrl + 'managed-by-you');
  }

  getClubInManagerView(clubCode) {
    return this.http.get(this.baseUrl + 'manage/' + clubCode);
  }

}
