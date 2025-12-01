import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  signal,
  output,
} from '@angular/core';
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
import { MatSelectModule } from '@angular/material/select';
import { forkJoin } from 'rxjs';
import { TextLoaderComponent } from '../common/componants/text-loader/text-loader.component';
import { LoaderService } from '../common/services/loader.service';
import { CommonModule } from '@angular/common';

interface conversation {
  message: string;
  processDetail: boolean;
  processDetailsData?: processSteps[] | null;
  timestamp: string;
  processingStatus: number;
  systemMsg: boolean;
  suggestions: any[] | null;
  data?: any;
}

interface ambiguity {
  metric_name: string;
  context: string;
  suggestions: string[];
  resolution_type: string;
}
interface processSteps {
  name: string;
  description: string;
}

@Component({
  selector: 'app-quary-box',
  imports: [
    TextLoaderComponent,
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
    MatSelectModule,
    MatInputModule,
    CommonModule,
  ],
  templateUrl: './quary-box.component.html',
  styleUrl: './quary-box.component.scss',
})
export class QuaryBoxComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  private shouldScrollToBottom = false;
  currentTab: string = 'chat';
  dataReady = output<boolean>();

  conversation: conversation[] = [];

  ambiguityData: any[] | null = null;

  loaderVisible: boolean = false;

  constructor(
    private _apiService: InsuranceAnalyticsService,
    private snackBar: MatSnackBar,
    private _dataService: DataService,
    private _loaderService: LoaderService
  ) {}

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  private scrollToBottom(): void {
    try {
      if (this.chatContainer) {
        this.chatContainer.nativeElement.scrollTop =
          this.chatContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }

  private triggerScroll(): void {
    this.shouldScrollToBottom = true;
  }

  private animateProgress(targetProgress: number): void {
    const processingMsgIndex = this.conversation.findIndex(
      (item) => item.processDetail === true
    );

    if (processingMsgIndex === -1) return;

    const currentProgress =
      this.conversation[processingMsgIndex].processingStatus;
    const step = 2; // Increment by 2% each time
    const interval = 30; // ms between updates

    let progress = currentProgress;

    const animate = () => {
      if (progress < targetProgress) {
        progress += step;
        if (progress > targetProgress) {
          progress = targetProgress;
        }
        this.conversation[processingMsgIndex].processingStatus = progress;

        if (progress < targetProgress) {
          setTimeout(animate, interval);
        }
      }
    };

    animate();
  }

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
      systemMsg: systemMsg,
      suggestions: null,
    });
    this.triggerScroll();
  }

  recordProcessMsg(step_id: number) {
    if (step_id == 0) {
      this.conversation.push({
        message:
          "I've updated the dashboard with: Show premiums written and combined ratio for Allstate and Progressive",
        processDetail: true,
        processingStatus: 0,
        processDetailsData: [
          {
            name: 'Parsing user query with financial context',
            description: 'Identifying companies, metrics, and time periods',
          },
        ],
        timestamp: this.getFormattedTime(),
        systemMsg: true,
        suggestions: null,
      });
      this.animateProgress(0);
      this.triggerScroll();
    } else if (step_id == 1) {
      // this.conversation[this.conversation.length - 1].processDetailsData?.push({
      //   name: 'Parsing user query with financial context',
      //   description: 'Identifying companies, metrics, and time periods',
      // });
      this.animateProgress(20);
      this.triggerScroll();
    } else if (step_id == 2) {
      this.conversation[this.conversation.length - 1].processDetailsData?.push({
        name: 'Direct SEC EDGAR database access',
        description: 'Retrieving 10-K and 10-Q filings from SEC servers',
      });
      this.animateProgress(40);
      this.triggerScroll();
    } else if (step_id == 3) {
      this.conversation[this.conversation.length - 1].processDetailsData?.push({
        name: 'Structured financial data extraction',
        description: 'Parsing XBRL data and standardizing formats',
      });
      this.animateProgress(60);
      this.triggerScroll();
    } else if (step_id == 4) {
      this.conversation[this.conversation.length - 1].processDetailsData?.push({
        name: 'Automated comparative analysis',
        description: 'Calculating metrics and normalizing across companies',
      });
      this.animateProgress(80);
      this.triggerScroll();
    } else if (step_id == 5) {
      this.conversation[this.conversation.length - 1].processDetailsData?.push({
        name: 'Formula verification & audit trail',
        description: 'Validating calculations and logging data sources',
      });
      this.animateProgress(100);
      this.triggerScroll();
    }
  }

  ngOnInit(): void {
    this._loaderService.isLoading$.subscribe({
      next: (res) => {
        this.loaderVisible = res;
      },
    });
  }

  parseQuery(userQuery: string) {
    if (userQuery.trim().length <= 3) {
      this.snackBar.open('Please enter a valid request to continue.', '', {
        horizontalPosition: 'start',
        verticalPosition: this.verticalPosition,
        duration: 3000,
      });
      return;
    }

    this.recordMsg(userQuery, false);
     this.recordProcessMsg(0);
    this._apiService.parseQuery({ query: userQuery }).subscribe({
      next: (res) => {
        if (res.success == true) {
          try {
            if (res.parsed.ambiguities && res.parsed.ambiguities.length == 0) {
              this._dataService.setParsedQuery(res.parsed);
               this.recordProcessMsg(1);
              this.resolveCompanies(res.parsed.companies);
            } else {
              this._dataService.setParsedQuery(res.parsed);
              this._dataService.fetchAmbiguities();

              this.addAmbiguitiesToConversation();
            }
          } catch {}
        } else {
        }
      },
    });
  }

  ll = {
    name: 're',
    suggestions: ['return_on_equity', 'retained_earnings', 'revenue'],
    context: null,
    resolved: false,
    resolved_to: null,
  };

  resolveCompanies(companies: string[]) {
    this._apiService
      .resolveMultipleCompanies({ company_inputs: companies })
      .subscribe({
        next: (res) => {
          try {
            this._dataService.setCompanyData(res.results);
            [2, 3].forEach((num, index) => {
              setTimeout(() => {
                this.recordProcessMsg(num);
              }, index * 1000);
            });
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

          this.dataReady.emit(true);
          

          // here check if multiple periods are available if yes then
          // go for varience analysis other wise just show till batch analysis

          if (this._dataService.API_DATA.PARSED_QUERY.time_periods.length > 1) {
            this.recordProcessMsg(4);
            this.startVarienceAnalysis();
          } else {
            this.recordProcessMsg(5);
            this.recordMsg("I've updated the dashboard.", true);
          }

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
          this.recordProcessMsg(5);
          this.recordMsg("I've updated the dashboard.", true);
          
        },
      });
    } else {
    }
  }

  resolveAmbiguity() {
    let data = this.conversation
      .filter((item) => item.suggestions != null)
      .map((item) => ({ ...item.data }));

    if (data.length === 0) {
      return;
    }

    const requests = data.map((payload) =>
      this._apiService.resolveAmbiguities(payload)
    );

    forkJoin(requests).subscribe({
      next: (results) => {
        results.forEach((res) => {
          this._dataService.API_DATA.PARSED_QUERY.metrics.push(res.metric_name);
        });

        if (results.length > 0) {
          this.recordMsg(`Ambiguities resolved: ${results.length}`, true);
          this.recordProcessMsg(0);
          this.recordProcessMsg(1)
          this.resolveCompanies(
            this._dataService.API_DATA.PARSED_QUERY.companies
          );
        } else {
          this.recordMsg(`Please resolve all the ambiguities.`, true);
        }
      },
      error: (error) => {
        console.error('Error resolving ambiguities:', error);
      },
    });
  }

  addAmbiguitiesToConversation() {
    let ambiguities: any[] = this._dataService.fetchAmbiguities();

    ambiguities.forEach((ambiguity) => {
      this.conversation.push({
        message: `I noticed you used "${ambiguity.metric_name}". Did you mean one of these metrics?`,
        processDetail: false,
        processingStatus: 10,
        processDetailsData: null,
        timestamp: this.getFormattedTime(),
        systemMsg: true,
        suggestions: ambiguity.suggestions,
        data: ambiguity,
      });
    });
    this.triggerScroll();
  }

  updateAmbiguityObject(data: any, index: number) {
    if (data.value) {
      this.conversation[index].data.metric_name = data.value;
    }
  }

  // Helper method to check if a step is the active (last) step
  isActiveStep(item: conversation, stepIndex: number): boolean {
    if (!item.processDetailsData) return false;
    return stepIndex === item.processDetailsData.length - 1;
  }

  selectOption(option: string): void {
    this.currentTab = option;
  }

  isSelected(option: string): boolean {
    return this.currentTab === option;
  }

  sampleQueries: any = [
    {
      query:
        'Show premiums written and combined ratio for Allstate and Progressive',
    },
    {
      query:
        ' Display revenue, net income, and operating margin for Liberty Mutual, State Farm, and GEICO',
    },
    {
      query:
        'Compare revenue, net income, operating margin, combined ratio and premiums written for Progressive, Allstate, and Travelers',
    },
    {
      query:
        'Show segment wise distribution of revenue for Progressive and Allstate',
    },
  ];

  fireUpAQueryFromSamples(query: string) {
    this.parseQuery(query);
  }
}
