import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms'; 
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from 'app/services/auth/auth.service';
import { AuthModalService } from 'app/services/auth-modal/auth-modal.service';
import { FlashAlertService } from 'app/services/flash-alert/flash-alert.service'; // 👈 Importa tu servicio de alertas
import { FlashComponent } from 'app/shared/flash/flash.component';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterModule, CommonModule, ReactiveFormsModule,FlashComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = ''; // 👈 Nueva propiedad para errores internos

  @Output() loginSuccess = new EventEmitter<void>();
  
  constructor(
    private authModal: AuthModalService,
    private authService: AuthService,
    private router: Router,
    private flashAlertService: FlashAlertService // 👈 Inyecta el servicio de alertas
  ) {}

  onSubmit() {
    if (!this.email || !this.password) return;

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        this.loginSuccess.emit();
        this.authModal.close();
        this.flashAlertService.showSuccess('¡Has iniciado sesión exitosamente!'); // 👈 Muestra alerta global
      },
      error: (err) => {
        console.error('Error al iniciar sesión:', err);
        this.errorMessage = 'Correo o contraseña incorrectos'; // 👈 Error local en el form
        // Si quieres además un error global podrías agregarlo aquí, pero en login normalmente solo local
      }
    });
  }

  redirectToRegister(): void {
    this.authModal.openRegister();
  }
}
