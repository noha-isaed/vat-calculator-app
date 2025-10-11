import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../service/auth.service';
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent implements OnInit {
  loading = false;
  error = '';
  results: any = null;
  form: FormGroup;
  reverseForm: FormGroup;
  reverseResults: any = null;
  userEmail: string = '';

  constructor(
    private fb: FormBuilder, 
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      totalSales: [0, [Validators.required, Validators.min(0)]],
      totalPurchases: [0, [Validators.required, Validators.min(0)]],
      operationsCount: [null],
      soldItemsCount: [0],
      purchasedItemsCount: [0]
    });

    this.reverseForm = this.fb.group({
      taxDue: [0, [Validators.required, Validators.min(0)]],
      totalPurchases: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {
    this.userEmail = this.authService.getUserEmail() || '';
  }

  logout() {
   // if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
      this.authService.logout();
   // }
  }

  calculate() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.error = '';
    this.results = null;



    const payload = this.form.value;
  
    this.http.post(`${environment.apiUrl}/api/calculate`, payload).subscribe({
      next: (res: any) => {
        this.results = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'حصل خطأ بالاتصال بالسيرفر';
        this.loading = false;
      }
    });
  }

  calculateReverse() {
    if (this.reverseForm.invalid) {
      this.reverseForm.markAllAsTouched();
      return;
    }

    const { taxDue, totalPurchases } = this.reverseForm.value;

    const inputVAT = totalPurchases / 1.16 * 0.16;
    const outputVAT = parseFloat(taxDue) + inputVAT;
    const requiredSales = outputVAT / 0.16 * 1.16;
    const netProfit = requiredSales / 1.16 - totalPurchases / 1.16;
    const profitMargin = (netProfit / (requiredSales / 1.16)) * 100;

    this.reverseResults = {
      requiredSales: parseFloat(requiredSales.toFixed(2)),
      outputVAT: parseFloat(outputVAT.toFixed(2)),
      inputVAT: parseFloat(inputVAT.toFixed(2)),
      netProfit: parseFloat(netProfit.toFixed(2)),
      profitMargin: parseFloat(profitMargin.toFixed(2))
    };
  }
}