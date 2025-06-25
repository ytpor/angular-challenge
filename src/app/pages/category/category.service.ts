import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from './category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  http = inject(HttpClient);
  baseUrl = import.meta.env.NG_APP_API_BASE_URL ?? 'http://localhost:8080/api';

  public getCategories(
    pageIndex: number,
    pageSize: number,
    sortField: string | null,
    sortOrder: string | null
  ): Observable<any> {
    let params = new HttpParams()
      .append('page', `${pageIndex}`)
      .append('size', `${pageSize}`);

    if (sortField && sortOrder) {
      params = params.append('sort', `${sortField},${sortOrder}`);
    }

    return this.http.get<any>(`${this.baseUrl}/v1/category`, { params });
  }

  getCategory(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.baseUrl}/v1/category/${id}`);
  }

  createCategory(category: any): Observable<Category> {
    return this.http.post<any>(`${this.baseUrl}/v1/category`, category);
  }

  updateCategory(category: any): Observable<Category> {
    return this.http.patch<Category>(`${this.baseUrl}/v1/category/${category.id}`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/v1/category/${id}`);
  }
}
