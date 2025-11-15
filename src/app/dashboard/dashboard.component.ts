import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { QuaryBoxComponent } from '../quary-box/quary-box.component';
import { LoaderWithInsightsComponent } from '../common/componants/loader-with-insights/loader-with-insights.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MetricCardComponent } from '../common/componants/metric-card/metric-card.component';
import { InsightsCardComponent } from '../common/componants/insights-card/insights-card.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    MetricCardComponent,
    MatTabsModule,
    LoaderWithInsightsComponent,
    QuaryBoxComponent,
    MatSidenavModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatSlideToggleModule,
    InsightsCardComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  isDarkTheme = true;

  cardView = [
    {
      metricName: 'Combined Ratio',
      tooltip: 'Measure of underwriting profitability (lower is better)',
      cards: [
        {
          companyName: 'Allstate',
          period: 'Q3 2024',
          metric: '91.2',
          trend: {
            trend: '1.2',
            trendUnit: 'pts',
            positive: true,
          },
        },
        {
          companyName: 'Progressive',
          period: 'Q3 2024',
          metric: '90.4',
          trend: {
            trend: '1.5',
            trendUnit: 'pts',
            positive: true,
          },
        },
      ],
    },
    {
      metricName: 'Premiums Written',
      tooltip: 'Measure of underwriting profitability (lower is better)',
      cards: [
        {
          companyName: 'Allstate',
          period: 'Q3 2024',
          metric: '$13.10B',
          trend: {
            trend: '1.2',
            trendUnit: '%',
            positive: true,
          },
        },
        {
          companyName: 'Progressive',
          period: 'Q3 2024',
          metric: '$13.90B',
          trend: {
            trend: '1.5',
            trendUnit: '%',
            positive: true,
          },
        },
      ],
    },
  ];

  insightsData = [
    {
      icon: 'trending_down',
      title: 'Declining Combined Ratio Trend',
      description:
        'Allstate has shown a consistent 3.2% improvement in combined ratio over the last 3 quarters, outperforming industry average by 4.7 percentage points. This suggests strong underwriting discipline and claims management.',
      source: 'Q3 2024 10-Q Analysis',
    },
    {
      icon: 'show_chart',
      title: 'Market Share Expansion in Commercial Lines',
      description:
        'Analysis of recent SEC filings indicates a 12% YoY growth in commercial auto premiums, significantly above peer average of 6%. Consider exploring factors driving this outperformance.',
      source: 'Comparative 10-K Analysis',
    },
    {
      icon: 'warning',
      title: 'Catastrophe Loss Exposure Increasing',
      description:
        'Recent 10-Q filings show a 23% increase in catastrophe-exposed property premiums without proportional reserve increases. Monitor loss development patterns closely in upcoming quarters.',
      source: 'Q2-Q3 2024 Filing Review',
    },
    {
      icon: 'policy',
      title: 'New Climate Risk Disclosure Requirements',
      description:
        'SEC proposed climate risk disclosure rules may require enhanced reporting starting Q1 2025. Companies with significant property exposure should prepare expanded disclosure frameworks.',
      source: 'SEC Regulatory Update',
    },
  ];

  constructor() {
    // Check if user has a saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkTheme = savedTheme === 'dark';
    } else {
      // Check system preference
      this.isDarkTheme = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
    }
    this.applyTheme();

    document.documentElement.classList.add('dark-theme');
  }

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    this.applyTheme();
  }

  private applyTheme(): void {
    if (this.isDarkTheme) {
      document.documentElement.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }

  onMenuClick() {}
}
