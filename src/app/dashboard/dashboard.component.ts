import { Component, OnInit, inject } from '@angular/core';
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
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { LineChart } from 'echarts/charts';
import { SunburstChart } from 'echarts/charts';
import { PieChart } from 'echarts/charts';
import {
  GridComponent,
  GridSimpleComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components';
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers';
import { MetricTableComponent } from '../common/componants/metric-table/metric-table.component';
import { SegmentTableComponent } from '../common/componants/segment-table/segment-table.component';
import { DataService } from '../common/services/data.service';
import { LoaderService } from '../common/services/loader.service';
import { CommonModule } from '@angular/common';
import { AmbiguityResolverComponent } from '../common/componants/ambiguity-resolver/ambiguity-resolver.component';
import { LegendDisplayComponent } from '../common/componants/legend-display/legend-display.component';

// Configure ECharts with both renderers
echarts.use([
  BarChart,
  GridComponent,
  CanvasRenderer,
  SVGRenderer,
  PieChart,
  LineChart,
  TooltipComponent,
  SunburstChart,
  LegendComponent,
  TitleComponent
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
    MetricTableComponent,
    SegmentTableComponent,
    CommonModule,
    LegendDisplayComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  providers: [
    provideEchartsCore({
      echarts,
      // Configure default renderer here
    }),
  ],
})
export class DashboardComponent implements OnInit {
  isDarkTheme = true;

  // Common chart configuration for crisp rendering
  private getCommonChartConfig() {
    return {
      useDirtyRect: true,
      devicePixelRatio: window.devicePixelRatio || 1,
    };
  }

  lineChartOption: echarts.EChartsCoreOption = {
    ...this.getCommonChartConfig(),
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 15, 25, 0.95)',
      borderColor: 'rgba(100, 100, 150, 0.3)',
      borderWidth: 1,
      borderRadius: 12,
      padding: 12,
      textStyle: {
        color: '#e0e0ff',
        fontSize: 12,
        fontWeight: 'normal',
      },
    },

    legend: {
      data: ['Allstate', 'Progressive'],
      bottom: 10,
      textStyle: {
        fontSize: 13,
        color: '#b0b0ff',
        fontWeight: '500',
      },
      itemGap: 25,
      itemWidth: 12,
      itemHeight: 12,
    },

    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'],
      axisLabel: {
        color: '#c0c0ff',
        fontSize: 12,
        fontWeight: '500',
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: 'rgba(160, 160, 255, 0.4)',
          width: 1.5,
        },
      },
      splitLine: { show: false },
    },

    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}%',
        fontSize: 12,
        color: '#c0c0ff',
        fontWeight: '500',
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: 'rgba(160, 160, 255, 0.4)',
          width: 1.5,
        },
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(80, 80, 120, 0.2)',
          type: 'dashed',
          width: 1,
        },
      },
    },

    backgroundColor: 'transparent',

    series: [
      {
        name: 'Allstate',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          width: 4,
          shadowColor: 'rgba(52, 152, 219, 0.5)',
          shadowBlur: 10,
          shadowOffsetY: 3,
        },
        itemStyle: {
          color: '#3498db',
          borderWidth: 2,
          borderColor: '#1a1a2e',
        },
        data: [104, 99, 101, 98],
      },
      {
        name: 'Progressive',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          width: 4,
          shadowColor: 'rgba(231, 76, 60, 0.5)',
          shadowBlur: 10,
          shadowOffsetY: 3,
        },
        itemStyle: {
          color: '#e74c3c',
          borderWidth: 2,
          borderColor: '#1a1a2e',
        },
        data: [96, 94, 95, 93],
      },
    ],
  };

  segmentStackedOption: any[] = [];
  commonSegmentsOption: any[] = [];
  

  barChartOption: echarts.EChartsCoreOption = {
    ...this.getCommonChartConfig(),
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 15, 25, 0.95)',
      borderColor: 'rgba(100, 100, 150, 0.3)',
      borderWidth: 1,
      borderRadius: 12,
      padding: 12,
      textStyle: {
        color: '#e0e0ff',
        fontSize: 12,
        fontWeight: 'normal',
      },
    },

    legend: {
      data: ['Allstate', 'Progressive'],
      bottom: 10,
      textStyle: {
        fontSize: 13,
        color: '#b0b0ff',
        fontWeight: '500',
      },
      itemGap: 25,
      itemWidth: 12,
      itemHeight: 12,
    },

    xAxis: {
      type: 'category',
      data: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'],
      axisLabel: {
        color: '#c0c0ff',
        fontSize: 12,
        fontWeight: '500',
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: 'rgba(160, 160, 255, 0.4)',
          width: 1.5,
        },
      },
      splitLine: { show: false },
    },

    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}%',
        fontSize: 12,
        color: '#c0c0ff',
        fontWeight: '500',
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: 'rgba(160, 160, 255, 0.4)',
          width: 1.5,
        },
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(80, 80, 120, 0.2)',
          type: 'dashed',
        },
      },
    },

    backgroundColor: 'transparent',

    series: [
      {
        name: 'Allstate',
        type: 'bar',
        barWidth: '40%',
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(52, 152, 219, 0.95)' },
              { offset: 1, color: 'rgba(41, 128, 185, 0.8)' },
            ],
          },
          borderRadius: [6, 6, 0, 0],
          shadowColor: 'rgba(52, 152, 219, 0.4)',
          // shadowBlur: 15,
          shadowOffsetY: 3,
          borderWidth: 0,
        },
        emphasis: {
          itemStyle: {
            shadowColor: 'rgba(52, 152, 219, 0.7)',
            shadowBlur: 25,
          },
        },
        data: [104, 99, 101, 98],
      },
      {
        name: 'Progressive',
        type: 'bar',
        barWidth: '40%',
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(231, 76, 60, 0.95)' },
              { offset: 1, color: 'rgba(192, 57, 43, 0.8)' },
            ],
          },
          borderRadius: [6, 6, 0, 0],
          shadowColor: 'rgba(231, 76, 60, 0.4)',
          shadowBlur: 15,
          shadowOffsetY: 3,
          borderWidth: 0,
        },
        emphasis: {
          itemStyle: {
            shadowColor: 'rgba(231, 76, 60, 0.7)',
            shadowBlur: 25,
          },
        },
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

  chartsData: any = [];

  data = [
    {
      name: 'Allstate',
      children: [
        {
          name: 'Property-Liability',
          value: 79.0,
        },
        {
          name: 'Protection Services',
          value: 12.5,
        },
        {
          name: 'Allstate Health & Benefits',
          value: 5.9,
        },
        {
          name: 'Run-off Property-Liability',
          value: 2.6,
        },
      ],
    },
  ];

  currentTabComparison: string = 'cards';

  sunburstOption: echarts.EChartsCoreOption = {
    ...this.getCommonChartConfig(),
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}%',
      backgroundColor: 'rgba(15, 15, 25, 0.95)',
      borderColor: 'rgba(100, 100, 150, 0.3)',
      borderWidth: 1,
      borderRadius: 8,
      textStyle: {
        color: '#e0e0ff',
        fontSize: 12,
      },
    },
    series: [
      {
        type: 'sunburst',
        data: this.data,
        radius: [0, '85%'],
        label: {
          rotate: 'radial',
          fontSize: 12,
          color: '#ffffff',
          fontWeight: '500',
          textBorderColor: 'transparent',
        },
        itemStyle: {
          borderWidth: 2,
          borderColor: '#1a1a2e',
        },
        levels: [
          {},
          {
            r0: '0%',
            r: '35%',
            itemStyle: {
              borderWidth: 2,
            },
            label: {
              rotate: 'tangential',
              fontSize: 13,
            },
          },
          {
            r0: '35%',
            r: '70%',
            label: {
              align: 'right',
              fontSize: 12,
            },
          },
          {
            r0: '70%',
            r: '85%',
            label: {
              position: 'outside',
              padding: 3,
              silent: false,
              fontSize: 11,
            },
            itemStyle: {
              borderWidth: 1,
            },
          },
        ],
      },
    ],
  };

  insightsData: any = [];

  constructor(
    private _dataService: DataService,
    private _loader: LoaderService
  ) {
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
  ngOnInit(): void {
    this._loader.isLoading$.subscribe({
      next: (res) => {
        this.isLoaderVisible = res;
      },
    });
  }

  isLoaderVisible = false;
  isDataAvailable = false;

  companies: any = null;

  metricTableData: any[] = [];

  referenceData: any = [
    {
      companyName: 'AllState',
      quarterlyLinks: [
        {
          linkLabel: '10-Q Q3 2024',
          link: '',
          icon: 'open_in_new',
        },
        {
          linkLabel: '10-Q Q2 2024',
          link: '',
          icon: 'open_in_new',
        },
        {
          linkLabel: '10-Q Q1 2024',
          link: '',
          icon: 'open_in_new',
        },
      ],
    },
  ];

  processedCardView: any = null;

  isComparison: boolean = true;

  currentTabSegment: string = 'stacked';
  segmentTableData: any[] = [];

  segmentPeriods: string | null = null;

  selectSegmentOption(option: string) {
    this.currentTabSegment = option;
  }

  isSegmentSelected(option: string): boolean {
    return this.currentTabSegment === option;
  }
  showData() {
    this.isDataAvailable = true;

    this.companies = this._dataService.API_DATA.COMPANY_DATA?.map(
      (data: any) => {
        return { name: data.company.name, logo: data.company.logo_url };
      }
    );

    if (
      this._dataService.API_DATA.PARSED_QUERY.segment_filter.dimension_type ==
      null
    ) {
      this.cardView = this._dataService.fetchCardsData(this.companies);

      this.chartsData = this._dataService.generateChartConfigs(this.cardView);

      this.metricTableData = this._dataService.generateMetricTableData(
        this.cardView
      );
      this.referenceData = this._dataService.generateReferenceData();

      this.isComparison = true;
      if(this._dataService.API_DATA.INSIGHTS_DATA){

        this.insightsData=this._dataService.generateInsights()
      }
    } else {
      this.isComparison = false;
      this.segmentPeriods =
        this._dataService.API_DATA.PARSED_QUERY.time_periods;
      this.segmentTableData = this._dataService.fetchSegmentTableData();

      const segmentWiseStackedChartData: any =this._dataService.getSegmentWiseChartData();


      const commonSegmentColumnCharts = this._dataService.generateCommonSegmentComparison(segmentWiseStackedChartData)  

      console.log(segmentWiseStackedChartData);
      

      this.segmentStackedOption = this._dataService.generateSegmentCharts(
        segmentWiseStackedChartData
      );
      this.commonSegmentsOption = this._dataService.generateCommonSegmentCharts(commonSegmentColumnCharts)
      console.log(this.segmentStackedOption);
      
    }

    
  }
  selectOption(option: string): void {
    this.currentTabComparison = option;
  }

  isSelected(option: string): boolean {
    return this.currentTabComparison === option;
  }

  tableColumns: any[] = [
    {
      header: 'Company',
      field: 'company',
      align: 'left',
    },
    {
      header: 'Quarter',
      field: 'quarter',
      align: 'left',
      cellColor: 'rgba(255, 255, 255, 0.53)',
    },
    {
      header: 'Value',
      field: 'value',
      align: 'right',
    },
    {
      header: 'Change',
      field: 'change',
      align: 'right',
      cellRenderer: (value: any, row: any) => {
        const isPositive = value >= 0;
        return {
          type: 'trend',
          trend: {
            direction: isPositive ? 'up' : 'down',
            value: `${value > 0 ? '+' : ''}${value}%`,
            color: isPositive ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)',
          },
        };
      },
    },
  ];

  tableData = [
    {
      company: 'Allstate',
      quarter: 'Q3 2024',
      value: '91.2%',
      change: -1.2,
    },
    {
      company: 'Progressive',
      quarter: 'Q3 2024',
      value: '90.4%',
      change: -1.5,
    },
    {
      company: 'Hartford',
      quarter: 'Q3 2024',
      value: '88.7%',
      change: 2.3,
    },
  ];

  getUniqueCompanies(cards: any[]): string[] {
    return [...new Set(cards.map((card) => card.companyName))];
  }

  // Get all cards for a specific company
  getCardsByCompany(cards: any[], companyName: string): any[] {
    return cards
      .filter((card) => card.companyName === companyName)
      .sort((a, b) => a.period.localeCompare(b.period)); // Sort by period
  }

  // Dynamic grid class based on company count
  getGridClass(columnCount: number): string {
    const gridClasses: { [key: number]: string } = {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
    };
    return gridClasses[columnCount] || 'grid-cols-4';
  }
}
