import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ItemInterface } from './items.interface';

@Injectable({
  providedIn: 'root',
})
export class ItemsService {
  constructor(private httpClient: HttpClient) {}

  getAllItems(): Observable<any[]> {
    return this.httpClient.get<any[]>('http://localhost:6942/items/allItems');
  }

  updateItem(itemId: string, item: FormData): Observable<ItemInterface> {
    const url = `http://localhost:6942/items/${itemId}`;

    const headers = new HttpHeaders().set('Cache-Control', 'no-cache');

    return this.httpClient.put<ItemInterface>(url, item, { headers });
  }

  deleteItem(item: ItemInterface): Observable<ItemInterface> {
    const url = `http://localhost:6942/items/${item._id}`;
    return this.httpClient.delete<ItemInterface>(url);
  }

  createItem(item: FormData): Observable<ItemInterface> {
    return this.httpClient.post<ItemInterface>(
      'http://localhost:6942/items/createItem',
      item
    );
  }
}
