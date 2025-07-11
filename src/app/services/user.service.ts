import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ApiResponse, User} from '../pages/shared/models/Models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiurl = 'http://localhost:8080/api/users';
  
  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]>{
    return this.http.get<User[]>(`${this.apiurl}`).pipe(
      catchError(error => {
        return throwError(() => error.error as ApiResponse<null>);
      })
    );;
  }

  getUserById(id:string): Observable<User>{
    return this.http.get<User>(`${this.apiurl}/${id}`).pipe(
      catchError(error => {
        return throwError(() => error.error as ApiResponse<null>);
      })
    );
  }

  createUser(userData: User): Observable<User> {
    console.log(userData)
    return this.http.post<User>(this.apiurl, userData).pipe(
      catchError(error => {
        return throwError(() => error.error as ApiResponse<null>);
      })
    );
  }
  
  updateUser(id: string, userData: User): Observable<User> {
    return this.http.put<User>(`${this.apiurl}/${id}`, userData).pipe(
      catchError(error => {
        return throwError(() => error.error as ApiResponse<null>);
      })
    );
  }

  deleteUserById(id?:string): Observable<any>{
    console.log(id)
    return this.http.delete(`${this.apiurl}/${id}`);
  }
}
