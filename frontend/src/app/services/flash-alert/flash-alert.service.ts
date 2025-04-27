// src/app/services/flash-alert.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FlashAlertService {
  private successMessageSubject = new BehaviorSubject<string | null>(null);
  private errorMessageSubject = new BehaviorSubject<string | null>(null);

  successMessage$ = this.successMessageSubject.asObservable();
  errorMessage$ = this.errorMessageSubject.asObservable();

  showSuccess(message: string) {
    this.successMessageSubject.next(message);
    setTimeout(() => this.clearSuccess(), 5000); 
  }

  showError(message: string) {
    this.errorMessageSubject.next(message);
    setTimeout(() => this.clearError(), 5000);
  }

  clearSuccess() {
    this.successMessageSubject.next(null);
  }

  clearError() {
    this.errorMessageSubject.next(null);
  }
}
