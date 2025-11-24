import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="login-container">
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-card">
        <h2>Iniciar sesión</h2>
        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" formControlName="email" class="form-control" />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input id="password" type="password" formControlName="password" class="form-control" />
        </div>
        <div *ngIf="errorMessage" class="error">{{ errorMessage }}</div>
        <button type="submit" class="btn-primary" [disabled]="loading">{{ loading ? 'Entrando...' : 'Entrar' }}</button>
        <button type="button" class="btn-secondary" (click)="showRegister = true">Registrarse</button>
      </form>

      <form *ngIf="showRegister" [formGroup]="registerForm" (ngSubmit)="onRegister()" class="login-card">
        <h2>Registro</h2>
        <div class="form-group">
          <label for="nombre">Nombre</label>
          <input id="nombre" formControlName="nombre" class="form-control" />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" formControlName="email" class="form-control" />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input id="password" type="password" formControlName="password" class="form-control" />
        </div>
        <div class="form-group">
          <label for="confirmPassword">Confirmar Password</label>
          <input id="confirmPassword" type="password" formControlName="confirmPassword" class="form-control" />
        </div>
        <div *ngIf="registerError" class="error">{{ registerError }}</div>
        <button type="submit" class="btn-primary" [disabled]="loading">{{ loading ? 'Registrando...' : 'Registrarse' }}</button>
        <button type="button" class="btn-secondary" (click)="showRegister = false">Volver a login</button>
      </form>
    </div>
  `,
  styles: [`.login-container { display:flex; justify-content:center; padding:2rem } .login-card{width:320px;padding:1rem;border-radius:8px;background:#fff} .form-group{margin-bottom:0.75rem}.error{color:#c00;margin-top:0.5rem}`]
})
export class LoginComponent {
  loginForm: FormGroup;
  registerForm: FormGroup;
  errorMessage: string = '';
  registerError: string = '';
  loading: boolean = false;
  showRegister: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/proyectos']);
        },
        error: (error: any) => {
          this.loading = false;
          this.errorMessage = error.error?.mensaje || 'Error al iniciar sesión';
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      const { nombre, email, password, confirmPassword } = this.registerForm.value;
      if (password !== confirmPassword) {
        this.registerError = 'Las contraseñas no coinciden';
        return;
      }
      this.loading = true;
      this.registerError = '';
      this.authService.register({ nombre, email, password }).subscribe({
        next: () => {
          this.registerError = 'Registro exitoso, ya puedes iniciar sesión';
          this.showRegister = false;
        },
        error: (error: any) => {
          this.loading = false;
          this.registerError = error.error?.mensaje || 'Error al registrar usuario';
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }
}