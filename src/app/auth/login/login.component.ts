import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports:[CommonModule,FormsModule,RouterModule]
})
export class LoginComponent {
  email = '';
  password = '';
  rememberMe = false;

  constructor(private router:Router){

  }
  submit() {
    console.log({
      email: this.email,
      password: this.password,
      rememberMe: this.rememberMe
    });

    if(this.email.trim() && this.password.trim()){
      localStorage.setItem("username",this.email)
      localStorage.setItem("password",this.password)
      this.router.navigateByUrl('/dashboard')
    }



  }
}
