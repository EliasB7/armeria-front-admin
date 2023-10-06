import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class LoginService {
  constructor(private httpClient: HttpClient) {}

  loginPost(loginData: any) {
    return this.httpClient.post('http://localhost:6942/auth/login', loginData);
  }
}
