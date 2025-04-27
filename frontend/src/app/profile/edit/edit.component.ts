import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileService } from 'app/services/profile/profile.service';
import { Router } from '@angular/router';
import { AuthService } from 'app/services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditProfileComponent implements OnInit {
  form!: ReturnType<FormBuilder['group']>;
  showPasswordError = false;
  passwordValidations: string[] = [];
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private profileService: ProfileService, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      full_name: ['', Validators.required],
      address: [''],
      current_password: [''],
      new_password: ['']
    });

    this.profileService.getProfile().subscribe({
      next: (res) => {
        this.form.patchValue(res.user);
      },
      error: (err) => console.error(err)
    });

    this.form.get('new_password')?.valueChanges.subscribe(value => {
      this.showPasswordError = !!(value && !this.validatePassword(value));
      this.passwordValidations = this.getPasswordValidationMessages(value);
    });
  }

  validatePassword(password: string): boolean {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);
  }

  getPasswordValidationMessages(password: string): string[] {
    const validations: string[] = [];
    if (password.length >= 8) validations.push('length');
    if (/[A-Z]/.test(password)) validations.push('uppercase');
    if (/[a-z]/.test(password)) validations.push('lowercase');
    if (/\d/.test(password)) validations.push('number');
    if (/[\W_]/.test(password)) validations.push('symbol');
    return validations;
  }

  isFormValid(): boolean {
    const newPass = this.form.get('new_password')?.value;
    return this.form.valid && (!newPass || this.validatePassword(newPass));
  }

  onSubmit(): void {
    const { username, email, new_password, current_password } = this.form.value;

    // Verifica si hay cambios sensibles
    const hasSensitiveChanges = new_password || this.hasChangedCoreFields();

    // Si hay cambios sensibles pero no se ingresó la contraseña actual
    if (hasSensitiveChanges && !current_password) {
      this.errorMessage = 'Debes ingresar tu contraseña actual para realizar cambios sensibles.';
      return;
    }

    if (!this.isFormValid()) return;

    this.profileService.updateProfile(this.form.value).subscribe({
      next: () => {
        this.successMessage = 'Perfil actualizado correctamente';
        // Espera un momento para mostrar mensaje y luego redirige
        setTimeout(() => this.router.navigate(['/profile']), 1500);
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Error al actualizar';
        console.error(err);
      }
    });
  }

  private hasChangedCoreFields(): boolean {
    const { username, email } = this.form.value;
    // Aquí comparamos con los valores actuales del usuario
    const currentUser = this.authService.getCurrentUser();
    return username !== currentUser.username || email !== currentUser.email;
  }

  hasSensitiveChanges(): boolean {
    const { username, email, new_password } = this.form.value;
    const currentUser = this.authService.getCurrentUser();
    return (
      username !== currentUser.username ||
      email !== currentUser.email ||
      !!new_password
    );
  }
}
