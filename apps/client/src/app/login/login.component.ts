import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '@lib/client/data-acess';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

type LoginformType = {
  email: FormControl<string>;
  password: FormControl<string>;
};

@Component({
  selector: 'client-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private router = inject(Router);

  errorMessage$ = new BehaviorSubject<string | null>(null);

  loginForm = new FormGroup(<LoginformType>{
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', [Validators.required]),
  });

  submit() {
    if (this.loginForm.valid && this.loginForm.dirty) {
      this.errorMessage$.next(null);
      const { email, password } = this.loginForm.getRawValue();
      console.log(
        `Trying to log in ${email} with password ${password.slice(0, 3)}*******`
      );

      this.authService
        .loginUser({ email, password })
        .pipe()
        .subscribe({
          next: () => {
            console.log(`User authenticated, redirecting to dashboard...`);
            this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
              this.router.navigate(['/home'])
            });
          },
          error: (err) => {
            if (err instanceof HttpErrorResponse) {
              this.errorMessage$.next(err.error.error);
            } else {
              this.errorMessage$.next(`unknown error occured while loggin in!`);
            }
            console.error(err);
          },
        });
    }
  }
}
