import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MsgBubbleComponent } from '../common/componants/msg-bubble/msg-bubble.component';
import { StepComponent } from '../common/step/step.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';

interface conversation {
  message: string;
  processDetail: boolean;
  processDetailsData?: processSteps[] | null;
  timestamp: string;
  processingStatus: number;
  systemMsg:boolean

}



interface processSteps {
  name: string;
  description: string;
}

@Component({
  selector: 'app-quary-box',
  imports: [
    MatProgressBarModule,
    StepComponent,
    MsgBubbleComponent,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './quary-box.component.html',
  styleUrl: './quary-box.component.scss',
})
export class QuaryBoxComponent {
  conversation: conversation[] = [
  {
    message:
      "I've updated the dashboard with: Show premiums written and combined ratio for Allstate and Progressive",
    processDetail: true,
    processingStatus: 10,
    processDetailsData: [
     
          {
            name: 'Parsing user query with financial context',
            description: 'Identifying companies, metrics, and time periods',
          },
          {
            name: 'Direct SEC EDGAR database access',
            description: 'Retrieving 10-K and 10-Q filings from SEC servers',
          },
          {
            name: 'Structured financial data extraction',
            description: 'Parsing XBRL data and standardizing formats',
          },
          {
            name: 'Automated comparative analysis',
            description: 'Calculating metrics and normalizing across companies',
          },
          {
            name: 'Formula verification & audit trail',
            description: 'Validating calculations and logging data sources',
          },
       
    ],
    timestamp: '6:48 PM',
    systemMsg:true
  },
  {
    message:
      "I've updated the dashboard with: Show premiums written and combined ratio for Allstate and Progressive",
    processDetail: false,
    processingStatus: 10,
    processDetailsData: null,
    timestamp: '6:48 PM',
    systemMsg:false
  },
];
}
