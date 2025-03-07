import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ApiResponse, Product } from '../pages/shared/models/Models';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  apiurl = '/api/products';
  
  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<ApiResponse<Product[]>>{
    return this.http.get<ApiResponse<Product[]>>(`${this.apiurl}`).pipe(
      catchError(error => {
        return throwError(() => error.error as ApiResponse<null>);
      })
    );;
  }

  getProductById(id:string): Observable<ApiResponse<Product>>{
    return this.http.get<ApiResponse<Product>>(`${this.apiurl}/${id}`).pipe(
      catchError(error => {
        return throwError(() => error.error as ApiResponse<null>);
      })
    );
  }

  createProduct(formData: FormData): Observable<ApiResponse<Product>> {
    return this.http.post<ApiResponse<Product>>(this.apiurl, formData).pipe(
      catchError(error => {
        return throwError(() => error.error as ApiResponse<null>);
      })
    );
  }

  updateProduct(id:string, formData: FormData): Observable<ApiResponse<Product>>{
    return this.http.put<ApiResponse<Product>>(`${this.apiurl}/${id}`, formData).pipe(
      catchError(error => {
        return throwError(() => error.error as ApiResponse<null>);
      })
    );;
  }

  deleteProductById(id:string): Observable<ApiResponse<any>>{
    return this.http.delete<ApiResponse<Product>>(`${this.apiurl}/${id}`).pipe(
      catchError(error => {
        return throwError(() => error.error as ApiResponse<null>);
      })
    );;
  }

}