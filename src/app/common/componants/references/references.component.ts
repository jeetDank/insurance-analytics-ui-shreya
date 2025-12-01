import { Component, input, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';

interface QuarterlyLink {
  linkLabel: string;
  link: string;
  icon: string;
  linkFilingType:string;
  linkPeriod:string
}

interface ReferenceData {
  companyName: string;
  quarterlyLinks: QuarterlyLink[];
}

@Component({
  selector: 'app-references',
  standalone: true, // ✅ Required
  imports: [MatExpansionModule],
  templateUrl: './references.component.html',
  styleUrl: './references.component.scss',
})
export class ReferencesComponent {
  readonly panelOpenState = signal(false);

  // ✅ Option 1: Using Angular v19 signal-based input (Recommended)
  refData = input<ReferenceData[]>([]);

  // If you want to initialize with data:
  // refData = signal<ReferenceData[]>([
  //   {
  //     companyName: 'AllState',
  //     quarterlyLinks: [
  //       {
  //         linkLabel: '10-Q Q3 2024',
  //         link: '',
  //         icon: 'open_in_new',
  //       },
  //       // ... more links
  //     ],
  //   },
  // ]);

  // Method to update data
 
}