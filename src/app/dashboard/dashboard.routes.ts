import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { PageNotFoundComponent } from '../common/componants/page-not-found/page-not-found.component';



export const routes: Routes = [
    
  {
    path:"",
    component:DashboardComponent,
    children:[
        
    ]
  }
    ,
  { path: '**', component:PageNotFoundComponent  }, // wildcard fallback
];
