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

  getClubInViewMode(clubCode) {
    return this.http.get(this.baseUrl + 'find-by-code/' + clubCode);
  }

  invitePlayers(clubId: any, players: any) {
    return this.http.put(this.baseUrl + clubId + '/add-players', players);
  }

  removePlayer(clubId: any, playerId: any) {
    return this.http.delete(this.baseUrl + clubId + '/remove-player/' + playerId);
  }

  setAsCaptain(clubId: any, playerId: any) {
    return this.http.put(this.baseUrl + clubId + '/set-as-captain/' + playerId, null);
  }

}
