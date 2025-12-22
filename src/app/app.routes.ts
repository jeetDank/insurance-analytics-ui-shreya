import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './common/componants/page-not-found/page-not-found.component';


export const routes: Routes = [

  {path:"",redirectTo:"login",pathMatch:'full'},
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.routes').then(
        (m) => m.routes
      ),
  },
 
  {
    path: 'login',
    loadChildren: () =>
      import('./auth/auth.routes').then(
        (m) => m.routes
      ),
  },
 
  { path: '**', component: PageNotFoundComponent }, // wildcard fallback
];
