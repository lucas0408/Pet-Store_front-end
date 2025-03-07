import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ApiResponse, User} from '../pages/shared/models/Models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiurl = 'https://44.211.143.190:8080/api/users';
  
  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<ApiResponse<User[]>>{
    return this.http.get<ApiResponse<User[]>>(`${this.apiurl}`).pipe(
      catchError(error => {
        return throwError(() => error.error as ApiResponse<null>);
      })
    );;
  }

  getUserById(id:string): Observable<ApiResponse<User>>{
    return this.http.get<ApiResponse<User>>(`${this.apiurl}/${id}`).pipe(
      catchError(error => {
        return throwError(() => error.error as ApiResponse<null>);
      })
    );
  }

  createUser(userData: User): Observable<ApiResponse<User>> {
    console.log(userData)
    return this.http.post<ApiResponse<User>>(this.apiurl, userData).pipe(
      catchError(error => {
        return throwError(() => error.error as ApiResponse<null>);
      })
    );
  }
  
  updateUser(id: string, userData: User): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${this.apiurl}/${id}`, userData).pipe(
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
