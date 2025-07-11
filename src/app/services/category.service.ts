import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ApiResponse, Category } from '../pages/shared/models/Models';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  apiurl = 'http://localhost:8080/api/categories';

  constructor(private http: HttpClient) { }

    getAllCategories(): Observable<Category[]>{
      return this.http.get<Category[]>(`${this.apiurl}`).pipe(
        catchError(error => {
          return throwError(() => error.error as ApiResponse<null>);
        })
      );;
    }
  
    getCategoryByName(name:string): Observable<Category>{
      return this.http.get<Category>(`${this.apiurl}/${name}`).pipe(
        catchError(error => {
          return throwError(() => error.error as ApiResponse<null>);
        })
      );
    }
  
    createCategory(formData:FormData): Observable<Category>{
      return this.http.post<Category>(this.apiurl, formData).pipe(
        catchError(error => {
          return throwError(() => error.error as ApiResponse<null>);
        })
      );;
    }
  
    updateCategory(id:string, formData:FormData): Observable<Category>{
      return this.http.put<Category>(`${this.apiurl}/${id}`, formData).pipe(
        catchError(error => {
          return throwError(() => error.error as ApiResponse<null>);
        })
      );;
    }
  
    deleteCategoryById(id:string): Observable<any>{
      return this.http.delete<Category>(`${this.apiurl}/${id}`).pipe(
        catchError(error => {
          return throwError(() => error.error as ApiResponse<null>);
        })
      );;
    }
}
