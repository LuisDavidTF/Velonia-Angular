import { Component, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthModalService } from 'app/services/auth-modal/auth-modal.service';
import { LoginComponent } from 'app/auth/login/login.component';
import { RegisterComponent } from 'app/auth/register/register.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-auth-modal',
  imports: [CommonModule, RouterModule, LoginComponent, RegisterComponent],
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.css'
})


@Injectable({ providedIn: 'root' })
export class AuthModalComponent {
  get visible$() {
    return this.authModal.modalVisible$;
  }
  
  get showRegister$() {
    return this.authModal.showRegister$;
  }
  
  constructor(private authModal: AuthModalService) {}

  close() {
    this.authModal.close();
  }

}
