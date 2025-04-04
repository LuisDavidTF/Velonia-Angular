import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule,RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  fullName: string = '';

  onSubmit() {
    // Aquí puedes llamar a un servicio de registro
    console.log('Registro:', {
      username: this.username,
      email: this.email,
      password: this.password,
      fullName: this.fullName
    });
  }
}