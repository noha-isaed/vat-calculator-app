import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,  // ← هذه السمة مهمة للنظام الجديد
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule], // ← الوحدات المستوردة هنا
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  loading = false;
  error = '';
  results: any = null;

  form;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({
      totalSales: [0, [Validators.required, Validators.min(0)]],
      totalPurchases: [0, [Validators.required, Validators.min(0)]],
      operationsCount: [null],
      soldItemsCount: [0],
      purchasedItemsCount: [0]
    });
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
}