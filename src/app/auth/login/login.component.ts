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

  ngOnInit(): void {

   const username =  localStorage.getItem("username"); 
   const password = localStorage.getItem("password");
   
   if(username && password){
    this.router.navigateByUrl('/dashboard')
   }
   
  }
}
