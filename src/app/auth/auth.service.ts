import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  setToken(token: string): void {
    localStorage.setItem('userToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('userToken');
  }

  logout(): void {
    localStorage.removeItem('userToken');
  }

  setUserData(user: any): void {
    localStorage.setItem('userData', JSON.stringify(user));
  }

  getUserData(): any | null {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }
}
