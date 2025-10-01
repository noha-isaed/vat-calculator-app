import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // يمكنك تغيير البريد الإلكتروني وكلمة المرور هنا
  private readonly VALID_EMAIL = 'noha.thaher@najah.edu';
  private readonly VALID_PASSWORD = 'Noha@298';
  
  private readonly AUTH_KEY = 'isLoggedIn';

  constructor(private router: Router) {}

  login(email: string, password: string): boolean {
    if (email === this.VALID_EMAIL && password === this.VALID_PASSWORD) {
      localStorage.setItem(this.AUTH_KEY, 'true');
      localStorage.setItem('userEmail', email);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(this.AUTH_KEY);
    localStorage.removeItem('userEmail');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return localStorage.getItem(this.AUTH_KEY) === 'true';
  }

  getUserEmail(): string | null {
    return localStorage.getItem('userEmail');
  }
}