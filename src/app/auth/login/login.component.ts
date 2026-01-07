import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports:[CommonModule,FormsModule,RouterModule]
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  rememberMe = false;
  error:string = "";
  constructor(private router:Router){

  }
  submit() {
    console.log({
      email: this.email,
      password: this.password,
      rememberMe: this.rememberMe
    });

    if(this.email.trim() && this.password.trim()){

      if(this.email == "admin@ideastoimpacts.com" && this.password == "admin@123"){
        localStorage.setItem("username",this.email)
        localStorage.setItem("password",this.password)
        this.router.navigateByUrl('/dashboard')
      }
      else{
        this.error = "Invalid email address or password"
      }

     


     
    }



  }
 isDarkTheme = true;
  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    this.applyTheme();
   
  }

private applyTheme(): void {
  if (this.isDarkTheme) {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.classList.add('dark-theme'); // Optional: keep for backward compatibility
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.classList.remove('dark-theme'); // Remove if using only data attribute
    localStorage.setItem('theme', 'light');
  }
}
  ngOnInit(): void {

   const username =  localStorage.getItem("username"); 
   const password = localStorage.getItem("password");
   
   if(username && password){
    this.router.navigateByUrl('/dashboard')
   }
   this.applyTheme()
   
  }
}
