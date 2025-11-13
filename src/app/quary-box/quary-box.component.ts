import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MsgBubbleComponent } from '../common/componants/msg-bubble/msg-bubble.component';

interface conversation {
  message: string;
  processDetail: boolean;
  processDetailsData?: processDetails | null;
  timestamp: string;
}

interface processDetails {
  processingStatus: number;
  steps: processSteps;
}

interface processSteps {
  name: string;
  description: string;
}

@Component({
  selector: 'app-quary-box',
  imports: [
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

      processDetail: false,
      processDetailsData: null,
      timestamp: '6:48 PM',
    },
  ];
}
