import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Travel } from 'src/app/common/travel';

@Injectable({
  providedIn: 'root',
})
export class OsmTravelService {
  private apiUrl = 'http://localhost:3000/api/travels'; 

  constructor(private http: HttpClient) {}

  getTravels() {
     return this.http.get<Travel[]>(this.apiUrl)
  } 
}
