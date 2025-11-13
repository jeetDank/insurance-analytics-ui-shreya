import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-page-not-found',
  imports: [ MatButtonModule,
    MatIconModule,MatCardModule
    ],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss'
})
export class PageNotFoundComponent {

   constructor(
    private router: Router,
    // private location: Location
  ) {}

  goHome(): void {
    this.router.navigate(['/']);
  }

  goBack(): void {
    // this.location.back();
  }

  contactSupport(): void {
    // Implement your support contact logic
    console.log('Contact support');
  }

}
