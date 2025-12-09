import { Component, input } from '@angular/core';

@Component({
  selector: 'app-insights-card',
  imports: [],
  templateUrl: './insights-card.component.html',
  styleUrl: './insights-card.component.scss'
})
export class InsightsCardComponent {
  icon = input.required<string>();
  title = input.required<string>();
  description = input.required<string>();
  source = input.required<string>();
}


// sample insights data 

// insightsData = [
//     {
//       icon: 'trending_down',
//       title: 'Declining Combined Ratio Trend',
//       description:
//         'Allstate has shown a consistent 3.2% improvement in combined ratio over the last 3 quarters, outperforming industry average by 4.7 percentage points. This suggests strong underwriting discipline and claims management.',
//       source: 'Q3 2024 10-Q Analysis',
//     },
//     {
//       icon: 'show_chart',
//       title: 'Market Share Expansion in Commercial Lines',
//       description:
//         'Analysis of recent SEC filings indicates a 12% YoY growth in commercial auto premiums, significantly above peer average of 6%. Consider exploring factors driving this outperformance.',
//       source: 'Comparative 10-K Analysis',
//     },
//     {
//       icon: 'warning',
//       title: 'Catastrophe Loss Exposure Increasing',
//       description:
//         'Recent 10-Q filings show a 23% increase in catastrophe-exposed property premiums without proportional reserve increases. Monitor loss development patterns closely in upcoming quarters.',
//       source: 'Q2-Q3 2024 Filing Review',
//     },
//     {
//       icon: 'policy',
//       title: 'New Climate Risk Disclosure Requirements',
//       description:
//         'SEC proposed climate risk disclosure rules may require enhanced reporting starting Q1 2025. Companies with significant property exposure should prepare expanded disclosure frameworks.',
//       source: 'SEC Regulatory Update',
//     },
//   ];