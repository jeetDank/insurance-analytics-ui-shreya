import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MsgBubbleComponent } from '../common/componants/msg-bubble/msg-bubble.component';
import { StepComponent } from '../common/step/step.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CustomFormulaComponent } from '../common/custom-formula/custom-formula.component';
import { InsuranceAnalyticsService } from '../common/services/insurance-analytics.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarModule,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { DataService } from '../common/services/data.service';

interface conversation {
  message: string;
  processDetail: boolean;
  processDetailsData?: processSteps[] | null;
  timestamp: string;
  processingStatus: number;
  systemMsg: boolean;
}

interface processSteps {
  name: string;
  description: string;
}

@Component({
  selector: 'app-quary-box',
  imports: [
    MatSnackBarModule,
    MatProgressBarModule,
    StepComponent,
    MsgBubbleComponent,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    CustomFormulaComponent,
  ],
  templateUrl: './quary-box.component.html',
  styleUrl: './quary-box.component.scss',
})
export class QuaryBoxComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
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
      systemMsg: true,
    },
    {
      message:
        "I've updated the dashboard with: Show premiums written and combined ratio for Allstate and Progressive",
      processDetail: false,
      processingStatus: 10,
      processDetailsData: null,
      timestamp: '6:48 PM',
      systemMsg: false,
    },
  ];

  constructor(
    private _apiService: InsuranceAnalyticsService,
    private snackBar: MatSnackBar,
    private _dataService: DataService
  ) {}
  getFormattedTime() {
    const now = new Date();
    let hours = now.getHours();
    let minutes: any = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    // Add leading zero to minutes if needed
    minutes = minutes < 10 ? '0' + minutes : minutes;

    return hours + ':' + minutes + ' ' + ampm;
  }

  recordMsg(msg: string, systemMsg: boolean = false) {
    this.conversation.push({
      message: msg,
      processDetail: false,
      processingStatus: 10,
      processDetailsData: null,
      timestamp: this.getFormattedTime(),
      systemMsg: false,
    });
  }

  recordProcessMsg() {
    this.conversation.push({
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
      systemMsg: true,
    });
  }

  ngOnInit(): void {}

  parseQuery(userQuery: string) {
    if (userQuery.trim().length <= 3) {
      this.snackBar.open('Please enter a valid request to continue.', '', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
      return;
    }

    this._apiService.parseQuery({ query: userQuery }).subscribe({
      next: (res) => {
        if (res.success == true) {
          try {
            this._dataService.setParsedQuery(res.parsed);
            this.resolveCompanies(res.parsed.companies);
          } catch {}
        } else {
        }
      },
    });
  }

  resolveCompanies(companies: string[]) {
    this._apiService
      .resolveMultipleCompanies({ company_inputs: companies })
      .subscribe({
        next: (res) => {
          try {
            this._dataService.setCompanyData(res.results);
            this.startBatchAnalysis();
          } catch {}
        },
      });
  }

  startBatchAnalysis() {
    let payload = this._dataService.fetchBatchAnalysisPayload();

    this._apiService.batchAnalysis(payload).subscribe({
      next: (res: any) => {
        if (res.success) {
          let data = {
            results: res.results,
            summary: res.summary,
          };
          this._dataService.setAnalysisData(data);
           this.startVarienceAnalysis() 

          console.log(this._dataService.API_DATA);
        } else {
        }
      },
    });
  }

  startVarienceAnalysis() {
    let payload = this._dataService.fetchVariencePayload();

    if (payload) {
      this._apiService.varienceAnalysis(payload).subscribe({
        next: (res: any) => {
          console.log(res);
          
        },
      });
    } else {
    }
  }
}
