import { ApplicationConfig } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { CalculatorComponent } from './calculator/calculator.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guard/auth.guard';

// تعريف المسارات
const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'calculator', 
    component: CalculatorComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/login' }
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
};