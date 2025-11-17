import { Component, signal } from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';

@Component({
  selector: 'app-references',
  imports: [MatExpansionModule],
  templateUrl: './references.component.html',
  styleUrl: './references.component.scss'
})
export class ReferencesComponent {

  readonly panelOpenState = signal(false);

  refData:any = [
    {
      companyName:"AllState",
      quarterlyLinks: [
        {
          linkLabel:"10-Q Q3 2024",
          link:"",
          icon:"open_in_new"

        },
        {
          linkLabel:"10-Q Q2 2024",
          link:"",
          icon:"open_in_new"

        },
        {
          linkLabel:"10-Q Q1 2024",
          link:"",
          icon:"open_in_new"

        }
      ]
    },
    {
      companyName:"Progressive",
      quarterlyLinks: [
        {
          linkLabel:"10-Q Q3 2024",
          link:"",
          icon:"open_in_new"

        },
        {
          linkLabel:"10-Q Q2 2024",
          link:"",
          icon:"open_in_new"

        },
        {
          linkLabel:"10-Q Q1 2024",
          link:"",
          icon:"open_in_new"

        }
      ]
    }
  ]


}
