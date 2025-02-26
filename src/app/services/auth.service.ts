import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse, Login } from '../pages/shared/models/Models';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = 'https://pet-store-render.onrender.com/api/auth/'


  constructor(private httpClient: HttpClient) { }

  login(login:Login):Observable<Login> {
    return this.httpClient.post<Login>(this.apiUrl+"login",login).pipe(
      catchError(error => {
        return throwError(() => error.error as ApiResponse<null>);
      })
    );;
  }
}
