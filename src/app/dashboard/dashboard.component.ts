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
import { ReferencesComponent } from '../common/componants/references/references.component';

import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
// import echarts core
import * as echarts from 'echarts/core';
// import necessary echarts components
import { BarChart } from 'echarts/charts';
import { LineChart } from 'echarts/charts';
import { SunburstChart } from 'echarts/charts';
import { PieChart } from 'echarts/charts';
import {
  GridComponent,
  GridSimpleComponent,
  LegendComponent,
  TooltipComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { MetricTableComponent } from '../common/componants/metric-table/metric-table.component';
echarts.use([
  BarChart,
  GridComponent,
  CanvasRenderer,
  PieChart,
  LineChart,
  TooltipComponent,
  SunburstChart,
  LegendComponent,
]);

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
    ReferencesComponent,
    NgxEchartsDirective,
    MetricTableComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  providers: [provideEchartsCore({ echarts })],
})
export class DashboardComponent {
  isDarkTheme = true;

  lineChartOption: echarts.EChartsCoreOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(50, 50, 50, 0.85)',
      borderRadius: 8,
      padding: 10,
      textStyle: { color: '#fff', fontSize: 12 },
    },

    legend: {
      data: ['Allstate', 'Progressive'],
      bottom: 10,
      textStyle: { fontSize: 14 },
    },

    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'],
      axisLabel: { color: '#fff', fontSize: 14 },
      axisLine: { show: true, color: '#fff' },
    },

    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}%',
        fontSize: 14,
        color: '#fff',
      },
      axisLine: { show: true, color: '#fff' },
      splitLine: { show: false }, // remove x grid line
    },

    // Transparent background
    backgroundColor: 'transparent',

    series: [
      {
        name: 'Allstate',
        type: 'line',
        smooth: true, // curved line
        symbol: 'circle',
        symbolSize: 9,
        lineStyle: { width: 3 },
        data: [104, 99, 101, 98],
      },
      {
        name: 'Progressive',
        type: 'line',
        smooth: true, // curved line
        symbol: 'circle',
        symbolSize: 9,
        lineStyle: { width: 3 },
        data: [96, 94, 95, 93],
      },
    ],
  };

  segmentRevenueOption: echarts.EChartsCoreOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(50, 50, 50, 0.85)',
      borderRadius: 8,
      padding: 10,
      textStyle: { color: '#fff', fontSize: 12 },
    },

    legend: {
      bottom: 10,
      textStyle: { fontSize: 14 },
    },

    xAxis: {
      type: 'value',
      axisLabel: { color: '#fff', fontSize: 14 },
      axisLine: { show: true, color: '#fff' },
      splitLine: { show: false }, // remove grid
    },

    yAxis: {
      type: 'category',
      data: ['Revenue'],
      axisLabel: { color: '#fff', fontSize: 14 },
      axisLine: { show: true, color: '#fff' },
    },

    backgroundColor: 'transparent',

    series: [
      {
        name: 'Property-Liability',
        type: 'bar',
        stack: 'total',
        data: [42.8],
      },
      {
        name: 'Protection Services',
        type: 'bar',
        stack: 'total',
        data: [6.8],
      },
      {
        name: 'Allstate Health & Benefits',
        type: 'bar',
        stack: 'total',

        data: [3.2],
      },
      {
        name: 'Run-off Property-Liability',
        type: 'bar',
        stack: 'total',
        itemStyle: {
          borderRadius: [0, 8, 8, 0], // rounded start
        },

        data: [1.4],
      },
    ],
  };

  barChartOption: echarts.EChartsCoreOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(50, 50, 50, 0.85)',
      borderRadius: 8,
      padding: 10,
      textStyle: { color: '#fff', fontSize: 12 },
    },

    legend: {
      data: ['Allstate', 'Progressive'],
      bottom: 10,
      textStyle: { fontSize: 14, color: '#fff' },
    },

    xAxis: {
      type: 'category',
      data: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'],
      axisLabel: { color: '#fff', fontSize: 14 },

      // show axis line
      axisLine: {
        show: true,
        lineStyle: { color: '#fff' },
      },

      // remove vertical grid lines
      splitLine: { show: false },
    },

    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}%',
        fontSize: 14,
        color: '#fff',
      },

      // show axis line
      axisLine: {
        show: true,
        lineStyle: { color: '#fff' },
      },

      // remove horizontal grid lines
      splitLine: { show: false },
    },

    backgroundColor: 'transparent',

    series: [
      {
        name: 'Allstate',
        type: 'bar',
        barWidth: '35%',
        data: [104, 99, 101, 98],
      },
      {
        name: 'Progressive',
        type: 'bar',
        barWidth: '35%',

        data: [96, 94, 95, 93],
      },
    ],
  };

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

  data = [
  {
    name: 'Allstate',
    children: [
      {
        name: 'Property-Liability',
        value: 79.0
      },
      {
        name: 'Protection Services',
        value: 12.5
      },
      {
        name: 'Allstate Health & Benefits',
        value: 5.9
      },
      {
        name: 'Run-off Property-Liability',
        value: 2.6
      }
    ]
  }
];
  sunburstOption: echarts.EChartsCoreOption = {
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c}%',
  },

  series: [
    {
      type: 'sunburst',
      data: this.data,
      radius: [0, '90%'],

      label: {
        rotate: 'radial',
        fontSize: 14,
        color:"#fff"
      },

      
    }
  ]
};
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
