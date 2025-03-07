import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ApiResponse, Category } from '../pages/shared/models/Models';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  apiurl = 'https://44.211.143.190:8080/api/categories';

  constructor(private http: HttpClient) { }

    getAllCategories(): Observable<ApiResponse<Category[]>>{
      return this.http.get<ApiResponse<Category[]>>(`${this.apiurl}`).pipe(
        catchError(error => {
          return throwError(() => error.error as ApiResponse<null>);
        })
      );;
    }
  
    getCategoryByName(name:string): Observable<ApiResponse<Category>>{
      return this.http.get<ApiResponse<Category>>(`${this.apiurl}/${name}`).pipe(
        catchError(error => {
          return throwError(() => error.error as ApiResponse<null>);
        })
      );
    }
  
    createCategory(formData:FormData): Observable<ApiResponse<Category>>{
      return this.http.post<ApiResponse<Category>>(this.apiurl, formData).pipe(
        catchError(error => {
          return throwError(() => error.error as ApiResponse<null>);
        })
      );;
    }
  
    updateCategory(id:string, formData:FormData): Observable<ApiResponse<Category>>{
      return this.http.put<ApiResponse<Category>>(`${this.apiurl}/${id}`, formData).pipe(
        catchError(error => {
          return throwError(() => error.error as ApiResponse<null>);
        })
      );;
    }
  
    deleteCategoryById(id:string): Observable<ApiResponse<any>>{
      return this.http.delete<ApiResponse<Category>>(`${this.apiurl}/${id}`).pipe(
        catchError(error => {
          return throwError(() => error.error as ApiResponse<null>);
        })
      );;
    }
}
