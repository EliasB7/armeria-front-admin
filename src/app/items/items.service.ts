import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ItemsService {
  constructor(private httpClient: HttpClient) {}

  getAllItems(): Observable<any[]> {
    return this.httpClient.get<any[]>('http://localhost:6942/items/allItems');
  }
}
