import { Component, input, OnInit, signal } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

interface stepsWiseInfo {
  icon: string;
  step_name: string;
}

@Component({
  selector: 'app-loader-with-insights',
  imports: [MatProgressSpinnerModule, MatIconModule],
  templateUrl: './loader-with-insights.component.html',
  styleUrl: './loader-with-insights.component.scss',
})
export class LoaderWithInsightsComponent implements OnInit {
  loaderMessage = input<string>('Loader Message');
  description = input<string>('Description');

  stepWiseInfo = input<stepsWiseInfo[]>([
    {
      icon: 'table_rows',
      step_name: 'Fetching SEC filings',
    },
    {
      icon: 'insert_chart',
      step_name: 'Processing Metrics',
    },
    {
      icon: 'trending_up',
      step_name: 'Generating Insights',
    },
  ]);

  visibleSteps = signal<number>(0);

  ngOnInit() {
    this.animateSteps();
  }

  animateSteps() {
    const steps = this.stepWiseInfo();
    let currentStep = 0;

    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        this.visibleSteps.set(currentStep + 1);
        currentStep++;
      } else {
        clearInterval(interval);
      }
    }, 500); // Delay between each step (500ms)
  }
}