import { Component } from '@angular/core';
import { LoginService } from './login.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(
    private loginService: LoginService,
    private router: Router,
    private authService: AuthService
  ) {}

  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  onLogin() {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;
      this.loginService.loginPost(loginData).subscribe(
        (response: any) => {
          this.authService.setUserData(response.user);
          this.authService.setToken(response.token);

          this.router.navigate(['/home']);
        },
        (error) => {
          console.error('Error en el inicio de sesión', error);
        }
      );
    }
  }
}
