import { Routes } from '@angular/router';
import { PageNotFoundComponent } from '../common/componants/page-not-found/page-not-found.component';
import { AuthenticationComponent } from './authentication.component';
import { LoginComponent } from './login/login.component';



export const routes: Routes = [
    
  {
    path:"",
    component:AuthenticationComponent,
    children:[
        { 
          path:"",
          component:LoginComponent,

        }
    ]
  }
    ,
  { path: '**', component:PageNotFoundComponent  }, // wildcard fallback
];
