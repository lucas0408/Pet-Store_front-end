import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login } from '../pages/shared/models/Models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = 'https://pet-store-render.onrender.com//api/auth/'


  constructor(private httpClient: HttpClient) { }

  login(login:Login):Observable<Login> {
    return this.httpClient.post<Login>(this.apiUrl+"login",login)
  }
}
