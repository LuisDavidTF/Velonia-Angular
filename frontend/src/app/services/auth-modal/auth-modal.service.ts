import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthModalService {

  private modalVisible = new BehaviorSubject<boolean>(false);
  private showRegister = new BehaviorSubject<boolean>(false);

  modalVisible$ = this.modalVisible.asObservable();
  showRegister$ = this.showRegister.asObservable();

  openLogin() {
    this.showRegister.next(false);
    this.modalVisible.next(true);
  }

  openRegister() {
    this.showRegister.next(true);
    this.modalVisible.next(true);
  }

  close() {
    this.modalVisible.next(false);
  }
}
