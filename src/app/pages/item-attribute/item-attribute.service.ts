import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ItemAttribute } from './item-attribute';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ItemAttributeService {

  http = inject(HttpClient);
  baseUrl = environment.apiUrl ?? 'http://localhost:8080/api';

  public getItemAttributes(
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

    return this.http.get<any>(`${this.baseUrl}/v1/attribute`, { params });
  }

  getItemAttribute(id: number): Observable<ItemAttribute> {
    return this.http.get<ItemAttribute>(`${this.baseUrl}/v1/attribute/${id}`);
  }

  createItemAttribute(itemAttribute: any): Observable<ItemAttribute> {
    return this.http.post<any>(`${this.baseUrl}/v1/attribute`, itemAttribute);
  }

  updateItemAttribute(itemAttribute: any): Observable<ItemAttribute> {
    return this.http.patch<ItemAttribute>(`${this.baseUrl}/v1/attribute/${itemAttribute.id}`, itemAttribute);
  }

  deleteItemAttribute(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/v1/attribute/${id}`);
  }
}
