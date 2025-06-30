import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  readonly alertSubject = new BehaviorSubject<{
    type: 'success' | 'info' | 'warning' | 'error',
    message: string,
    details: string[]
  } | null>(null);

  alert$ = this.alertSubject.asObservable();

  showAlert(type: 'success' | 'info' | 'warning' | 'error', message: string, details: string[]) {
    this.alertSubject.next({ type, message, details });
  }

  clearAlert() {
    this.alertSubject.next(null);
  }
}
