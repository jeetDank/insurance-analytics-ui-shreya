import { Injectable } from '@angular/core';
import { ECharts } from 'echarts/core';
import { BehaviorSubject } from 'rxjs';

interface apiData {
  PARSED_QUERY: any | null;
  COMPANY_DATA: any[] | null;
  ANALYSIS_DATA: any | null;
  AMBIGUITY_DATA: any | null;
  INSIGHTS_DATA: any | null;
}

export interface SegmentData {
  metric_name: string;
  value: string;
  unit?: string;
  percentage: string;
  children?: SegmentData[];
}

export interface ProgressTracker {
  main_title: string;
  sub_title: string;
  process: [
    {
      logo: string;
      msg: string;
    }
  ];
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor() {}

  API_DATA: apiData = {
    PARSED_QUERY: null,
    COMPANY_DATA: null,
    ANALYSIS_DATA: null,
    AMBIGUITY_DATA: null,
    INSIGHTS_DATA: null,
  };

  HistoryBucket$ = new BehaviorSubject<any[]>([]);

  

  FormulaBucket$ = new BehaviorSubject<any[]>([]);



  updateFunctionList(data: any) {
    console.log(data);
    
    this.FormulaBucket$.next(data);
  }
  addQueryToHistory(conversation: any) {
    const history = [...this.HistoryBucket$.value];

    if (history.length > 2) {
      history.shift();
    }

    history.push({
      conversation,
      API_DATA: { ...this.API_DATA },
    });

    this.HistoryBucket$.next(history);

    // localStorage.setItem('historyBucket', JSON.stringify(history));
  }

  setParsedQuery(data: any) {
    this.API_DATA.PARSED_QUERY = data;
  }
  setCompanyData(data: any) {
    this.API_DATA.COMPANY_DATA = data;
  }
  setAnalysisData(data: any) {
    this.API_DATA.ANALYSIS_DATA = data;
  }
  setInsightsData(data: any) {
    this.API_DATA.INSIGHTS_DATA = data;
  }

  clearData() {
    this.API_DATA.ANALYSIS_DATA = null;
    this.API_DATA.COMPANY_DATA = null;
    this.API_DATA.PARSED_QUERY = null;
  }

  fetchBatchAnalysisPayload() {
    if (
      this.API_DATA.COMPANY_DATA != null &&
      this.API_DATA.PARSED_QUERY != null
    ) {
      let payload: any = {
        companies: [],
        time_periods: null,
        filing_type: '10-Q',
        analysis_depth: 2,
      };

      payload.companies = this.API_DATA.COMPANY_DATA.filter(
        (company: any) => company.success
      ).map((data) => {
        return {
          cik: data.company.identifiers.cik,
          name: data.company.name,
        };
      });

      payload.time_periods = this.API_DATA.PARSED_QUERY.time_periods;

      return payload;
    } else {
      return false;
    }
  }

  // generateCustomeCardData(formulaData: any) {
  //   if (this.API_DATA.ANALYSIS_DATA) {
  //     this.API_DATA.ANALYSIS_DATA.results.forEach((company: any) => {});
  //   } else {
  //   }

  //   this.API_DATA.ANALYSIS_DATA;
  // }

  createAmbiguityPayload(ambiguities: any[]) {
    let ambiguityData = ambiguities.map((ambiguity: any) => {
      return {
        metric_name: ambiguity.selected_ambiguity,
        context: 'string',
        suggestions: ambiguity.suggestions,
        resolution_type: 'select',
      };
    });
    return ambiguityData;
  }

  fetchAmbiguities() {
    if (this.API_DATA.PARSED_QUERY) {
      let ambiguityData = this.API_DATA.PARSED_QUERY.ambiguities.map(
        (ambiguity: any) => {
          return {
            query: ambiguity.name,
            selected_ambiguity: '',
            suggestions: ambiguity.suggestions,
          };
        }
      );
      return ambiguityData;
    } else {
      return false;
    }
  }

  fetchVariencePayload() {
    if (this.API_DATA.ANALYSIS_DATA != null) {
      const companies: any[] = [];
      this.API_DATA.ANALYSIS_DATA.results.forEach((company: any) => {
        company.statements.forEach((quarter: any) => {
          let filterRequestedMetrics: any = {};

          this.API_DATA.PARSED_QUERY.metrics.forEach((metric: any) => {
            filterRequestedMetrics[metric] = {
              name: quarter.all_metrics[metric]?.name,
              value: quarter.all_metrics[metric]?.value,
              concept: quarter.all_metrics[metric]?.concept,
              unit: quarter.all_metrics[metric]?.unit,
            };
          });
          let context_info = quarter?.context_info;

          context_info.is_consolidated = true;

          const data = {
            cik: company.cik,
            company_name: company.company_name,
            requested_metrics: this.API_DATA.PARSED_QUERY.metrics,
            period: quarter.context_info.period_label_text,
            analysis_result: {
              metrics: filterRequestedMetrics,
              metadata: quarter.metadata,
              context_info: context_info,
            },
          };

          companies.push(data);
        });
      });

      let payload = {
        companies: companies,
      };

      return payload;
    } else {
      return false;
    }
  }

  getQuarterYear(dateString: string): string {
    const date = new Date(dateString);
    const month = date.getMonth(); // 0-11 (June = 5)
    const year = date.getFullYear(); // 2025

    const quarter = Math.floor(month / 3) + 1; // Math.floor(5/3) + 1 = 1 + 1 = 2

    return `Q${quarter} ${year}`; // Returns "Q2 2025"
  }
  fetchCardsData(companies: { name: string; logo: string }[]) {
    const requested_metrics = this.API_DATA.PARSED_QUERY.metrics;

    const companyWiseCardData = this.API_DATA.ANALYSIS_DATA.results.map(
      (company: any) => {
        // Find matching company logo

        const matchedCompany = companies.find(
          (c) =>
            c.name
              .toLowerCase()
              .includes(
                this.formatCompanyName(company.company_name).toLowerCase()
              ) || c.name.toLowerCase() == company.company_name.toLowerCase()
        );

        const companyLogo = matchedCompany?.logo || '';

        return {
          company_name: company.company_name,
          cik: company.cik,
          logo: companyLogo, // Add logo at company level
          period: company?.statements?.context_info?.period_label_text,
          quarters: company.statements.map((qtr: any) => ({
            period: qtr.context_info.period_label_text,
            logo: companyLogo, // Add logo to each quarter
            metrics: requested_metrics.reduce((acc: any, metric: any) => {
              acc[metric] = this.extractMetricData(qtr.all_metrics[metric]);
              return acc;
            }, {}),
          })),
        };
      }
    );

    return this.populateCardView(companyWiseCardData);
  }

  extractMetricData(metricData: any): {
    value: string;
    unit: string;
    currency: string;
    trend: string;
  } {
    // Handle null or undefined
    if (!metricData) {
      return {
        value: 'N/A',
        unit: '',
        currency: '',
        trend: '',
      };
    }

    // Extract value
    const value = this.formatValue(metricData.value, metricData.format_type);

    // Extract unit (from xbrl_unit or unit field)
    const unit = metricData.xbrl_unit || metricData.unit || '';

    // Extract currency (if format_type is currency, assume USD or extract from unit)
    const currency = metricData.format_type === 'currency' ? 'USD' : '';

    // Calculate trend from growth rates
    // const trend = this.calculateTrend(metricData);

    const trend = metricData?.qoq_growth_rate
      ? metricData?.qoq_growth_rate
      : 'N/A' + '%';

    return {
      value,
      unit,
      currency,
      trend,
    };
  }

  private formatValue(value: number | null, formatType: string): string {
    if (value === null || value === undefined) {
      return 'N/A';
    }

    if (formatType === 'currency') {
      // Convert to billions/millions for readability
      if (Math.abs(value) >= 1_000_000_000) {
        return `${(value / 1_000_000_000).toFixed(2)}B`;
      } else if (Math.abs(value) >= 1_000_000) {
        return `${(value / 1_000_000).toFixed(2)}M`;
      } else if (Math.abs(value) >= 1_000) {
        return `${(value / 1_000).toFixed(2)}K`;
      }
      return value.toFixed(2);
    }

    // For other format types, return as is
    return value.toString();
  }

  // private calculateTrend(metricData: any): string {
  //   // Priority: YoY > QoQ
  //   if (
  //     metricData.yoy_growth_rate !== null &&
  //     metricData.yoy_growth_rate !== undefined
  //   ) {
  //     return this.formatTrend(metricData.yoy_growth_rate, 'YoY');
  //   }

  //   if (
  //     metricData.qoq_growth_rate !== null &&
  //     metricData.qoq_growth_rate !== undefined
  //   ) {
  //     return this.formatTrend(metricData.qoq_growth_rate, 'QoQ');
  //   }

  //   return 'N/A';
  // }

  // private formatTrend(growthRate: number, period: string): string {
  //   const percentage = (growthRate * 100).toFixed(2);
  //   const sign = growthRate >= 0 ? '+' : '';
  //   return `${sign}${percentage}% ${period}`;
  // }

  populateCardView(companyData: any[]): any[] {
    // First, we need to get all unique metrics across all companies
    const allMetrics = this.getAllUniqueMetrics(companyData);

    // Then create a card view entry for each metric
    return allMetrics.map((metricName) => ({
      metricName: this.formatMetricName(metricName),
      tooltip: this.getMetricTooltip(metricName),
      cards: companyData.flatMap((company) => {
        // Sort quarters chronologically for each company
        const sortedQuarters = [...company.quarters].sort((a: any, b: any) => {
          return this.compareQuarters(a.period, b.period);
        });

        // Map through sorted quarters for each company
        return sortedQuarters.map((quarter: any) => {
          const metricData = quarter.metrics[metricName];

          return {
            companyName: this.formatCompanyName(company.company_name),
            period: quarter.period !== 'QNaN NaN' ? quarter.period : 'N/A',
            metric: this.formatMetricValue(metricData),
            logo: quarter.logo,
            trend: {
              trend: metricData?.trend ? metricData?.trend : 'N/A',
              trendUnit: '%',
              positive: metricData?.trend
                ? metricData?.trend > 0
                  ? true
                  : false
                : null,
            },
          };
        });
      }),
    }));
  }
  populateCustomCardView(companyData: any[]): any[] {
    // First, we need to get all unique metrics across all companies
    const allMetrics = this.getAllUniqueMetrics(companyData);

    // Then create a card view entry for each metric
    return allMetrics.map((metricName) => ({
      metricName: this.formatMetricName(metricName),
      tooltip: this.getMetricTooltip(metricName),
      cards: companyData.flatMap((company) => {
        // Sort quarters chronologically for each company
        const sortedQuarters = [...company.quarters].sort((a: any, b: any) => {
          return this.compareQuarters(a.period, b.period);
        });

        // Map through sorted quarters for each company
        return sortedQuarters.map((quarter: any) => {
          const metricData = quarter.metrics[metricName];

          return {
            companyName: this.formatCompanyName(company.company_name),
            period: quarter.period !== 'QNaN NaN' ? quarter.period : 'N/A',
            metric: this.formatMetricValueWithPrefixPostfix(metricData),
            logo: quarter.logo,
            trend: {
              trend: metricData?.trend ? metricData?.trend : 'N/A',
              trendUnit: '%',
              positive: metricData?.trend
                ? metricData?.trend > 0
                  ? true
                  : false
                : null,
            },
          };
        });
      }),
    }));
  }

  /**
   * Format metric value with prefix and postfix applied
   */
  private formatMetricValueWithPrefixPostfix(metricData: any): string {
    if (!metricData || metricData.value === null || metricData.value === undefined) {
      return 'N/A';
    }

    const value = metricData.value;
    const prefix = metricData.prefix || '';
    const postfix = metricData.postfix || '';

    // Scale the value based on postfix
    let scaledValue = value;
    
    switch (postfix) {
      case 'B':
        scaledValue = value / 1_000_000_000;
        break;
      case 'M':
        scaledValue = value / 1_000_000;
        break;
      case 'K':
        scaledValue = value / 1_000;
        break;
    }

    // Format the number with appropriate decimal places
    let formattedValue: string;
    const absValue = Math.abs(scaledValue);
    
    if (absValue >= 100) {
      formattedValue = scaledValue.toFixed(1);
    } else if (absValue >= 10) {
      formattedValue = scaledValue.toFixed(2);
    } else if (absValue >= 1) {
      formattedValue = scaledValue.toFixed(2);
    } else if (absValue > 0) {
      formattedValue = scaledValue.toFixed(3);
    } else {
      formattedValue = '0';
    }

    // Remove trailing zeros and decimal point if not needed
    formattedValue = parseFloat(formattedValue).toString();

    // Apply prefix and postfix
    return `${prefix}${formattedValue}${postfix}`;
  }

  // Helper function to compare quarters chronologically
  private compareQuarters(periodA: string, periodB: string): number {
    // Handle invalid periods
    if (periodA === 'QNaN NaN' || !periodA) return 1;
    if (periodB === 'QNaN NaN' || !periodB) return -1;

    // Extract quarter and year from "Q1 2023" format
    const matchA = periodA.match(/Q(\d+)\s+(\d+)/);
    const matchB = periodB.match(/Q(\d+)\s+(\d+)/);

    if (!matchA || !matchB) return 0;

    const [, quarterA, yearA] = matchA;
    const [, quarterB, yearB] = matchB;

    // Compare by year first, then by quarter
    const yearDiff = parseInt(yearA) - parseInt(yearB);
    if (yearDiff !== 0) return yearDiff;

    return parseInt(quarterA) - parseInt(quarterB);
  }

  private getAllUniqueMetrics(companyData: any[]): string[] {
    const metricsSet = new Set<string>();

    companyData.forEach((company) => {
      company.quarters.forEach((quarter: any) => {
        Object.keys(quarter.metrics).forEach((metricName) => {
          metricsSet.add(metricName);
        });
      });
    });

    return Array.from(metricsSet);
  }

  private formatMetricName(metricName: string): string {
    // Convert snake_case to Title Case
    return metricName
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private formatCompanyName(fullName: string): string {
    // Extract main company name (remove legal suffixes)
    // "HARTFORD INSURANCE GROUP, INC." -> "Hartford"
    const name = fullName.split(',')[0].split(' ')[0];
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }

  private formatMetricValue(metricData: any): string {
    if (!metricData || metricData.value === 'N/A') {
      return 'N/A';
    }

    // If it has currency, prepend $
    if (metricData.currency) {
      return `$${metricData.value}`;
    }

    return metricData.value;
  }

  private formatTrendData(trendString: string, currency?: string): any {
    // Parse trend string like "+12.50% YoY" or "N/A"
    if (!trendString || trendString === 'N/A') {
      return {
        trend: 'N/A',
        trendUnit: '',
        positive: null,
      };
    }

    // Extract the percentage value
    const match = trendString.match(/([+-]?\d+\.?\d*)/);
    if (!match) {
      return {
        trend: 'N/A',
        trendUnit: '',
        positive: null,
      };
    }

    const trendValue = match[1];
    const isPositive = !trendString.startsWith('-');

    // Determine trend unit based on metric type
    // For currency metrics, use '%', for ratios might use 'pts'
    const trendUnit = currency ? '%' : 'pts';

    return {
      trend: trendValue.replace(/[+-]/, ''), // Remove sign
      trendUnit: trendUnit,
      positive: isPositive,
    };
  }

  private getMetricTooltip(metricName: string): string {
    // Define tooltips for known metrics
    const tooltips: { [key: string]: string } = {
      revenue: 'Total revenue generated during the period',
      net_income: 'Net profit after all expenses and taxes',
      premiums_earned: 'Insurance premiums recognized as revenue',
      premiums_written: 'Total premiums from new and renewed policies',
      combined_ratio: 'Measure of underwriting profitability (lower is better)',
      loss_ratio:
        'Claims and loss adjustment expenses divided by earned premiums',
      expense_ratio: 'Underwriting expenses divided by written premiums',
    };

    return (
      tooltips[metricName] || `${this.formatMetricName(metricName)} metric`
    );
  }

  generateChartConfigs(metricsData: any[]): any {
    const results: any[] = [];

    // Helper function for common chart config
    function getCommonChartConfig() {
      return {
        useDirtyRect: true,
        devicePixelRatio: window.devicePixelRatio || 1,
      };
    }

    // Helper function to generate gradient colors for bars
    function getGradientColor(baseColor: string, index: number): any {
      const gradients = [
        {
          base: 'rgba(52, 152, 219, 0.95)',
          end: 'rgba(41, 128, 185, 0.8)',
          shadow: 'rgba(52, 152, 219, 0.4)',
          shadowHover: 'rgba(52, 152, 219, 0.7)',
        },
        {
          base: 'rgba(231, 76, 60, 0.95)',
          end: 'rgba(192, 57, 43, 0.8)',
          shadow: 'rgba(231, 76, 60, 0.4)',
          shadowHover: 'rgba(231, 76, 60, 0.7)',
        },
        {
          base: 'rgba(46, 204, 113, 0.95)',
          end: 'rgba(39, 174, 96, 0.8)',
          shadow: 'rgba(46, 204, 113, 0.4)',
          shadowHover: 'rgba(46, 204, 113, 0.7)',
        },
        {
          base: 'rgba(243, 156, 18, 0.95)',
          end: 'rgba(211, 84, 0, 0.8)',
          shadow: 'rgba(243, 156, 18, 0.4)',
          shadowHover: 'rgba(243, 156, 18, 0.7)',
        },
        {
          base: 'rgba(155, 89, 182, 0.95)',
          end: 'rgba(142, 68, 173, 0.8)',
          shadow: 'rgba(155, 89, 182, 0.4)',
          shadowHover: 'rgba(155, 89, 182, 0.7)',
        },
      ];

      const colorSet = gradients[index % gradients.length];
      return {
        gradient: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: colorSet.base },
            { offset: 1, color: colorSet.end },
          ],
        },
        shadow: colorSet.shadow,
        shadowHover: colorSet.shadowHover,
      };
    }

    // Helper function to generate solid colors for lines
    function getLineColor(index: number): string {
      const colors = [
        '#3498db', // Blue
        '#e74c3c', // Red
        '#2ecc71', // Green
        '#f39c12', // Orange
        '#9b59b6', // Purple
        '#1abc9c', // Turquoise
        '#e67e22', // Carrot
        '#34495e', // Dark gray
        '#16a085', // Green sea
        '#c0392b', // Dark red
      ];
      return colors[index % colors.length];
    }

    // Helper function to extract and sort periods chronologically
    function extractAndSortPeriods(cards: any[]): string[] {
      const periodsSet = new Set<string>();
      cards.forEach((card) => periodsSet.add(card.period));

      const periods = Array.from(periodsSet);

      // Sort periods chronologically (handles Q1-Q4 and years)
      return periods.sort((a, b) => {
        const [quarterA, yearA] = a.split(' ');
        const [quarterB, yearB] = b.split(' ');

        const yearCompare = parseInt(yearA) - parseInt(yearB);
        if (yearCompare !== 0) return yearCompare;

        const qNumA = parseInt(quarterA.replace('Q', ''));
        const qNumB = parseInt(quarterB.replace('Q', ''));
        return qNumA - qNumB;
      });
    }

    // Helper function to parse metric values with units
    function parseMetricValue(metricStr: string): {
      value: number;
      unit: string;
    } {
      const numericValue = parseFloat(metricStr.replace(/[^0-9.-]/g, ''));

      if (metricStr.includes('B')) {
        return { value: numericValue, unit: 'B' };
      } else if (metricStr.includes('M')) {
        return { value: numericValue / 1000, unit: 'B' }; // Convert to billions
      } else if (metricStr.includes('K')) {
        return { value: numericValue / 1000000, unit: 'B' }; // Convert to billions
      } else if (metricStr.includes('%')) {
        return { value: numericValue, unit: '%' };
      }
      return { value: numericValue, unit: '' };
    }

    // Helper function to detect dominant unit and format Y-axis
    function getYAxisFormatter(cards: any[]): {
      formatter: (value: number) => string;
      unit: string;
    } {
      // Sample first few cards to determine unit
      const sampleMetric = cards[0]?.metric || '';

      if (sampleMetric.includes('%')) {
        return {
          formatter: (value: number) => `${value.toFixed(1)}%`,
          unit: '%',
        };
      } else if (sampleMetric.includes('B') || sampleMetric.includes('M')) {
        return {
          formatter: (value: number) => `$${value.toFixed(2)}B`,
          unit: 'B',
        };
      }
      return {
        formatter: (value: number) => value.toFixed(2),
        unit: '',
      };
    }

    // Process each metric
    metricsData.forEach((metric) => {
      // Extract and sort periods dynamically
      const periods = extractAndSortPeriods(metric.cards);

      // Get Y-axis formatter based on metric type
      const yAxisConfig = getYAxisFormatter(metric.cards);

      // Group data by company
      const companiesData: { [key: string]: (number | null)[] } = {};
      const companiesSet = new Set<string>();

      // Collect all unique companies
      metric.cards.forEach((card: any) => {
        companiesSet.add(card.companyName);
      });

      // Initialize data arrays for each company
      const companies = Array.from(companiesSet);
      companies.forEach((company) => {
        companiesData[company] = new Array(periods.length).fill(null);
      });

      // Fill in the data
      metric.cards.forEach((card: any) => {
        const periodIndex = periods.indexOf(card.period);
        if (periodIndex !== -1) {
          const parsed = parseMetricValue(card.metric);
          companiesData[card.companyName][periodIndex] = parsed.value;
        }
      });

      // Create LINE CHART series
      const lineSeries = companies.map((company, index) => {
        const color = getLineColor(index);
        return {
          name: company,
          type: 'line' as const,
          smooth: true,
          symbol: 'circle' as const,
          symbolSize: 8,
          lineStyle: {
            width: 4,
            shadowColor: `${color}80`,
            shadowBlur: 10,
            shadowOffsetY: 3,
          },
          itemStyle: {
            color: color,
            borderWidth: 2,
            borderColor: '#1a1a2e',
          },
          data: companiesData[company],
        };
      });

      // Create BAR CHART series
      const barSeries = companies.map((company, index) => {
        const colorConfig = getGradientColor(company, index);
        return {
          name: company,
          type: 'bar' as const,
          barWidth: '40%',
          itemStyle: {
            color: colorConfig.gradient,
            borderRadius: [6, 6, 0, 0],
            shadowColor: colorConfig.shadow,
            shadowBlur: 15,
            shadowOffsetY: 3,
            borderWidth: 0,
          },
          emphasis: {
            itemStyle: {
              shadowColor: colorConfig.shadowHover,
              shadowBlur: 25,
            },
          },
          data: companiesData[company],
        };
      });

      // Create LINE CHART configuration
      const lineChartConfig: any = {
        ...getCommonChartConfig(),

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
          formatter: (params: any) => {
            if (!Array.isArray(params)) params = [params];
            let result = `<strong>${params[0].axisValue}</strong><br/>`;
            params.forEach((item: any) => {
              if (item.value !== null) {
                const formattedValue = yAxisConfig.formatter(item.value);
                result += `${item.marker} ${item.seriesName}: <strong>${formattedValue}</strong><br/>`;
              }
            });
            return result;
          },
        },

        legend: {
          data: companies,
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
          data: periods,
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
            formatter: yAxisConfig.formatter,
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

        series: lineSeries,
      };

      // Create BAR CHART configuration
      const barChartConfig: any = {
        ...getCommonChartConfig(),

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
          formatter: (params: any) => {
            if (!Array.isArray(params)) params = [params];
            let result = `<strong>${params[0].axisValue}</strong><br/>`;
            params.forEach((item: any) => {
              if (item.value !== null) {
                const formattedValue = yAxisConfig.formatter(item.value);
                result += `${item.marker} ${item.seriesName}: <strong>${formattedValue}</strong><br/>`;
              }
            });
            return result;
          },
        },

        legend: {
          data: companies,
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
          data: periods,
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
            formatter: yAxisConfig.formatter,
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

        series: barSeries,
      };

      // Add to results
      results.push({
        metric_name: metric.metricName,
        line_chart_config: lineChartConfig,
        bar_chart_config: barChartConfig,
        tooltip: metric.tooltip,
      });
    });

    return results;
  }

  // generateMetricTableData(cardData: any) {
  //   const tableData = cardData.map((data: any) => {
  //     const tableData = data.cards.map((card: any) => {
  //       return {
  //         company: card?.companyName,
  //         quarter: card?.period,
  //         value: card?.metric,
  //         change: card?.trend?.trend,
  //       };
  //     });

  //     return {
  //       metric_name: data.metricName,
  //       tableData: tableData,
  //     };
  //   });

  //   return tableData;
  // }

  generateMetricTableData(cardData: any) {
    const quarterRenderer = (value: any): any => ({
      type: 'trend',
      value: value?.value,
      trend: {
        direction: value?.change >= 0 ? 'up' : 'down',
        value: `${Math.abs(value?.change).toFixed(2)}%`,
        color: value?.change >= 0 ? 'rgb(34,197,94)' : 'rgb(239,68,68)',
      },
    });

    const tableData = cardData.map((data: any) => {
      const processedData = data.cards.map((card: any) => {
        return {
          company: card?.companyName,
          quarter: card?.period,
          value: card?.metric,
          change: card.trend?.trend,
        };
      });

      // Get unique quarters and companies
      const quarters = [
        ...new Set(processedData.map((d: any) => d.quarter)),
      ].sort();
      const companies = [...new Set(processedData.map((d: any) => d.company))];

      // Generate columns
      const columns: any[] = [
        {
          header: 'Company',
          field: 'company',
          align: 'left',
        },
        ...quarters.map((quarter: any) => ({
          header: quarter,
          field: quarter.toLowerCase().replace(/\s+/g, '_'), // "Q2 2025" -> "q2_2025"
          align: 'right' as const,
          cellRenderer: quarterRenderer,
        })),
      ];

      // Transform data into table row format
      const transformedData = companies.map((company) => {
        const row: any = { company };

        processedData
          .filter((d: any) => d.company === company)
          .forEach((d: any) => {
            const fieldName = d.quarter.toLowerCase().replace(/\s+/g, '_');
            row[fieldName] = {
              value: d.value,
              change: d.change,
            };
          });

        return row;
      });

      return {
        metric_name: data.metricName,
        columns: columns,
        data: transformedData,
      };
    });

    return tableData;
  }

  generateReferenceData() {
    if (this.API_DATA.ANALYSIS_DATA != null) {
      let finalData: any = [];

      this.API_DATA.ANALYSIS_DATA.results.forEach((company: any) => {
        let referenceObject = {
          companyName: company.company_name,
          quarterlyLinks: <any>[],
        };

        company.statements.forEach((quarter: any) => {
          referenceObject.quarterlyLinks.push({
            linkLabel: quarter.context_info.period_label_text,
            linkPeriod: quarter.context_info.period_label_text,
            linkFilingType: quarter.metadata.filing_type,
            link: quarter.metadata.filing_url,
            icon: 'open_in_new',
          });
        });

        finalData.push(referenceObject);
      });

      return finalData;
    } else {
      return false;
    }
  }

  // Add this interface if not already present

  // Main function to fetch segment table data
  fetchSegmentTableData() {
    const requested_metrics = this.API_DATA.PARSED_QUERY.metrics;

    return this.API_DATA.ANALYSIS_DATA.results.map((company: any) => ({
      company_name: company.company_name,
      cik: company.cik,
      quarters: company.statements.map((qtr: any) => ({
        period: qtr.context_info.period_label_text,
        metrics: requested_metrics.map((metric: any) => ({
          metric_name: metric,
          tableData: this.extractSegmentTableData(qtr.all_metrics[metric]),
        })),
      })),
    }));
  }

  // Recursive function to extract and format segment data

  // Recursive function to extract and format segment data
  extractSegmentTableData(metricData: any): SegmentData[] {
    if (
      !metricData ||
      !metricData.children ||
      metricData.children_count === 0
    ) {
      return [];
    }

    const children = metricData.children;
    const childrenArray: SegmentData[] = [];

    // Get the parent/total value for percentage calculation
    const parentValue = metricData.value;

    // Convert children object to array
    Object.keys(children).forEach((childKey) => {
      const child = children[childKey];

      // Check if this child has children using children_count
      const hasChildren = child.children_count && child.children_count > 0;

      // Handle dimension categories - keep their structure instead of flattening
      if (child.is_dimension_category && child.value === null) {
        // Create a parent entry for the category with its children properly nested
        if (hasChildren) {
          const categoryData: SegmentData = {
            metric_name: this.formatSegmentName(
              child.name,
              child.segment_name || childKey
            ),
            value: '$0.00',
            percentage: '0.0%',
            children: this.extractSegmentChildren(
              child.children,
              parentValue,
              1
            ),
          };
          childrenArray.push(categoryData);
        }
      } else {
        // This is an actual segment with value
        const segmentData: SegmentData = {
          metric_name: this.formatSegmentName(
            child.name,
            child.segment_name || childKey
          ),
          value: this.formatCurrencyValue(child.value),
          percentage: this.calculatePercentage(child.value, parentValue),
          // Use children_count to determine if we should recurse
          children: hasChildren
            ? this.extractSegmentChildren(child.children, child.value, 1)
            : undefined,
        };
        childrenArray.push(segmentData);
      }
    });

    return childrenArray;
  }

  // Helper function to recursively process nested children
  private extractSegmentChildren(
    childrenObj: any,
    parentValue: number,
    level: number
  ): SegmentData[] {
    const childrenArray: SegmentData[] = [];

    Object.keys(childrenObj).forEach((childKey) => {
      const child = childrenObj[childKey];

      // Check if this child has children using children_count
      const hasChildren = child.children_count && child.children_count > 0;

      // Handle dimension categories - keep their structure
      if (child.is_dimension_category && child.value === null) {
        // Create a container for the category with its children properly nested
        if (hasChildren) {
          // Create a parent entry for the category
          const categoryData: SegmentData = {
            metric_name: this.formatSegmentName(
              child.name,
              child.segment_name || childKey
            ),
            value: '$0.00',
            percentage: '0.0%',
            children: this.extractSegmentChildren(
              child.children,
              parentValue,
              level + 1
            ),
          };
          childrenArray.push(categoryData);
        }
        return;
      }

      // Regular segment with value
      const segmentData: SegmentData = {
        metric_name: this.formatSegmentName(
          child.name,
          child.segment_name || childKey
        ),
        value: this.formatCurrencyValue(child.value),
        percentage: this.calculatePercentage(child.value, parentValue),
        // Use children_count to determine if we should recurse
        children: hasChildren
          ? this.extractSegmentChildren(child.children, child.value, level + 1)
          : undefined,
      };

      childrenArray.push(segmentData);
    });

    return childrenArray;
  }

  // Format segment name for display
  private formatSegmentName(name: string, segmentName: string): string {
    // Use segment_name if available, otherwise clean up the name
    if (segmentName && segmentName !== 'null') {
      // Convert camelCase or snake_case to Title Case
      return segmentName
        .replace(/([A-Z])/g, ' $1')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase())
        .trim();
    }

    // Clean up the full name
    return name
      .replace(/^.*_by_/i, '')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase())
      .trim();
  }

  // Format currency values
  private formatCurrencyValue(value: number | null): string {
    if (value === null || value === undefined) {
      return '$0.00';
    }

    const absValue = Math.abs(value);

    if (absValue >= 1000000000) {
      return `$${(value / 1000000000).toFixed(2)}B`;
    } else if (absValue >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else if (absValue >= 1000) {
      return `$${(value / 1000).toFixed(2)}K`;
    } else {
      return `$${value.toFixed(2)}`;
    }
  }

  // Calculate percentage relative to parent
  private calculatePercentage(
    value: number | null,
    parentValue: number | null
  ): string {
    if (
      value === null ||
      value === undefined ||
      parentValue === null ||
      parentValue === 0
    ) {
      return '0.0%';
    }

    const percentage = (value / parentValue) * 100;
    return `${percentage.toFixed(1)}%`;
  }

  // Alternative: Get segment data for a specific metric and quarter
  getSegmentDataForMetric(
    companyName: string,
    period: string,
    metricName: string
  ): SegmentData[] {
    const company = this.API_DATA.ANALYSIS_DATA.results.find(
      (c: any) => c.company_name === companyName
    );

    if (!company) return [];

    const quarter = company.statements.find(
      (qtr: any) => qtr.context_info.period_label_text === period
    );

    if (!quarter) return [];

    const metricData = quarter.all_metrics[metricName];
    return this.extractSegmentTableData(metricData);
  }

  generateInsights() {
    const data: any = this.API_DATA.INSIGHTS_DATA;
    const insightsData = [];
    const companies = Object.keys(data);

    // Helper function to format numbers
    const formatNumber = (num: any) => {
      if (num >= 1000000000) return `$${(num / 1000000000).toFixed(1)}B`;
      if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
      return `$${num.toLocaleString()}`;
    };

    // Helper function to format percentage
    const formatPercent = (num: any) => {
      return `${Math.abs(num).toFixed(1)}%`;
    };

    // Analyze each company's data
    companies.forEach((key) => {
      const item = data[key];
      const {
        company,
        metric,
        segment,
        variances,
        trend,
        volatility,
        periods,
        values,
      } = item;

      if (variances && variances.length > 0) {
        const variance = variances[0];
        const absoluteChange = variance.absolute_change;
        const percentChange =
          variance.percent_change ||
          (absoluteChange / variance.from_value) * 100;

        // Generate insight based on trend and magnitude
        let insight = null;

        // Significant growth insight
        if (trend === 'increasing' && Math.abs(percentChange) > 2) {
          insight = {
            icon: 'trending_up',
            title: `${company} - Strong ${metric} Growth`,
            description: `${company} shows a ${formatPercent(
              percentChange
            )} increase in ${metric} from ${variance.from_period} to ${
              variance.to_period
            }, moving from ${formatNumber(
              variance.from_value
            )} to ${formatNumber(
              variance.to_value
            )}. This ${trend} trend with ${volatility} volatility indicates stable performance.`,
            source: `${variance.to_period} Analysis`,
          };
        }

        // Declining trend insight
        if (trend === 'decreasing' && Math.abs(percentChange) > 2) {
          insight = {
            icon: 'trending_down',
            title: `${company} - ${metric} Decline`,
            description: `${company} experienced a ${formatPercent(
              percentChange
            )} decrease in ${metric} from ${variance.from_period} to ${
              variance.to_period
            }. ${metric} dropped from ${formatNumber(
              variance.from_value
            )} to ${formatNumber(
              variance.to_value
            )}. Monitor this ${trend} trend closely.`,
            source: `${variance.to_period} Analysis`,
          };
        }

        // Stable performance insight
        if (trend === 'stable' || Math.abs(percentChange) < 2) {
          insight = {
            icon: 'show_chart',
            title: `${company} - Consistent ${metric} Performance`,
            description: `${company} maintains stable ${metric} performance with minimal change of ${formatPercent(
              percentChange
            )} between ${variance.from_period} and ${
              variance.to_period
            }. Current ${metric} stands at ${formatNumber(variance.to_value)}.`,
            source: `${variance.to_period} Analysis`,
          };
        }

        // High volatility warning
        if (volatility === 'high') {
          insight = {
            icon: 'warning',
            title: `${company} - High ${metric} Volatility`,
            description: `${company} shows high volatility in ${metric} with a ${formatPercent(
              percentChange
            )} change. ${metric} fluctuated from ${formatNumber(
              variance.from_value
            )} to ${formatNumber(variance.to_value)} between ${
              variance.from_period
            } and ${variance.to_period}. Increased monitoring recommended.`,
            source: `${variance.to_period} Risk Analysis`,
          };
        }

        if (insight) {
          insightsData.push(insight);
        }
      }
    });

    // Add comparative insights if multiple companies
    if (companies.length > 1) {
      const comparisons = companies.map((key) => ({
        company: data[key].company,
        metric: data[key].metric,
        latestValue: data[key].values[data[key].values.length - 1],
        percentChange:
          data[key].variances[0]?.percent_change ||
          (data[key].variances[0]?.absolute_change /
            data[key].variances[0]?.from_value) *
            100,
      }));

      // Find top performer
      const topPerformer = comparisons.reduce((max, curr) =>
        curr.percentChange > max.percentChange ? curr : max
      );

      insightsData.push({
        icon: 'emoji_events',
        title: `Top Performer: ${topPerformer.company}`,
        description: `${topPerformer.company} leads with ${formatPercent(
          topPerformer.percentChange
        )} growth in ${topPerformer.metric}, reaching ${formatNumber(
          topPerformer.latestValue
        )}. This outperforms peers in the current analysis period.`,
        source: 'Comparative Analysis',
      });
    }

    return insightsData;
  }

  getSegmentWiseChartData() {
    if (this.API_DATA.ANALYSIS_DATA != null) {
      const companies: any[] = [];
      this.API_DATA.ANALYSIS_DATA.results.forEach((company: any) => {
        company.statements.forEach((quarter: any) => {
          // Helper function to calculate segment value recursively
          const calculateSegmentValue = (segment: any): number => {
            // If segment has a direct value property, return it
            if (
              segment.value !== undefined &&
              segment.value !== null &&
              typeof segment.value === 'number'
            ) {
              return segment.value;
            }

            // If segment has children, sum their values recursively
            if (segment.children) {
              // Handle if children is an object instead of array
              const childrenArray = Array.isArray(segment.children)
                ? segment.children
                : Object.values(segment.children);

              return childrenArray.reduce((sum: number, child: any) => {
                return sum + calculateSegmentValue(child);
              }, 0);
            }

            return 0;
          };

          // Process segments for each metric
          const processMetricSegments = (metricObject: any) => {
            const segments: any[] = [];

            // Check if metric object exists and has children
            if (!metricObject || !metricObject.children) {
              return segments;
            }

            // Handle both array and object children
            const childrenArray = Array.isArray(metricObject.children)
              ? metricObject.children
              : Object.values(metricObject.children);

            // If childrenArray is empty or not valid, return empty segments
            if (!childrenArray || childrenArray.length === 0) {
              return segments;
            }

            childrenArray.forEach((child: any) => {
              const segmentName =
                child.name || child.value || child.label || 'Unknown';
              const segmentValue = calculateSegmentValue(child);

              segments.push({
                segment_name: segmentName,
                value: segmentValue,
              });
            });

            return segments;
          };

          // Build metrics object with segments - only for metrics in PARSED_QUERY
          const metricsData: any = {};
          this.API_DATA.PARSED_QUERY.metrics.forEach((metricName: string) => {
            // Get the full metric object from all_metrics
            const metricObject = quarter.all_metrics[metricName];

            if (metricObject) {
              metricsData[metricName] = {
                total: metricObject.value || 0,
                segments: processMetricSegments(metricObject),
              };
            }
          });

          const data = {
            company_name: company.company_name,
            period: quarter.context_info.period_label_text,
            metrics: metricsData,
          };

          companies.push(data);
        });
      });

      return companies;
    } else {
      return null;
    }
  }

  generateSegmentCharts(data: any[]) {
    const chartConfigs: any[] = [];

    // Color palette
    const colorPalette = [
      '#3b82f6', // blue
      '#10b981', // green
      '#ef4444', // red
      '#f59e0b', // orange
      '#8b5cf6', // purple
      '#ec4899', // pink
      '#06b6d4', // cyan
      '#84cc16', // lime
    ];

    data.forEach((item: any) => {
      const metrics = Object.keys(item.metrics);

      metrics.forEach((metricName: string) => {
        const metricData = item.metrics[metricName];

        // Skip if no segments
        if (!metricData.segments || metricData.segments.length === 0) {
          return;
        }

        // Create legends array
        const legends = metricData.segments.map(
          (segment: any, index: number) => ({
            name: snakeToTitleCase(segment.segment_name),
            color: colorPalette[index % colorPalette.length],
            value: segment.value,
            percentage: (segment.value / metricData.total) * 100,
          })
        );

        // Create series for each segment
        const series = metricData.segments.map(
          (segment: any, index: number) => {
            const isFirst = index === 0;
            const isLast = index === metricData.segments.length - 1;

            return {
              name: segment.segment_name,
              type: 'bar',
              stack: 'total',
              barWidth: '40px',
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 1,
                  y2: 0,
                  colorStops: [
                    {
                      offset: 0,
                      color: colorPalette[index % colorPalette.length],
                    },
                    {
                      offset: 1,
                      color: colorPalette[index % colorPalette.length] + 'cc',
                    }, // 80% opacity
                  ],
                },
                borderRadius: isFirst
                  ? [8, 0, 0, 8]
                  : isLast
                  ? [0, 8, 8, 0]
                  : [0, 0, 0, 0],
                borderWidth: 0,
              },
              emphasis: {
                itemStyle: {
                  color: colorPalette[index % colorPalette.length],
                },
              },
              data: [segment.value / 1000000], // Convert to millions
            };
          }
        );

        const chartConfig = {
          useDirtyRect: true,
          devicePixelRatio: window.devicePixelRatio || 1,

          title: {
            text: ``,
          },

          tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            backgroundColor: 'rgba(15, 15, 25, 0.95)',
            borderColor: 'rgba(100, 100, 150, 0.3)',
            borderWidth: 1,
            borderRadius: 12,
            padding: 12,
            textStyle: {
              color: '#d7d7d7ff',
              fontSize: 12,
              fontWeight: 'normal',
            },
            formatter: (params: any) => {
              let result = `<div style="font-weight: 600; margin-bottom: 8px;">${item.period}</div>`;
              params.forEach((param: any) => {
                result += `
                <div style="display: flex; justify-content: space-between; align-items: center; margin: 4px 0;">
                  <span style="display: inline-block; width: 10px; height: 10px; background: ${
                    param.color
                  }; border-radius: 50%; margin-right: 8px;"></span>
                  <span style="margin-right: 20px;">${snakeToTitleCase(
                    param.seriesName
                  )}</span>
                  <span style="font-weight: 600;">$${param.value.toFixed(
                    2
                  )}M</span>
                </div>
              `;
              });
              return result;
            },
          },
          grid: {
            left: '1px',
            right: '4%',
            bottom: '15%',
            top: '15%',
            containLabel: true,
          },

          xAxis: {
            type: 'value',
            axisLabel: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
            },
          },

          yAxis: {
            type: 'category',
            data: [metricName.replace(/_/g, ' ').toUpperCase()],
            axisLabel: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
            },
          },

          backgroundColor: 'transparent',

          series: series,
        };

        chartConfigs.push({
          company: item.company_name,
          period: item.period,
          metric: snakeToTitleCase(metricName),
          legends: { total: metricData.total, legends: legends }, // legends array for custom legends
          config: chartConfig,
        });
      });
    });

    return chartConfigs;
  }

  generateCommonSegmentComparison(data: any[]) {
    const commonSegments: any = {};

    // First pass: collect all segments and their data
    data.forEach((item: any) => {
      const metrics = Object.keys(item.metrics);

      metrics.forEach((metricName: string) => {
        const metricData = item.metrics[metricName];

        if (!metricData.segments || metricData.segments.length === 0) {
          return;
        }

        metricData.segments.forEach((segment: any) => {
          const segmentKey: string = `${metricName}_${segment.segment_name}`;

          // Initialize segment if it doesn't exist
          if (!commonSegments[segmentKey]) {
            commonSegments[segmentKey] = {
              metric: metricName,
              segment_name: segment.segment_name,
              periods: {},
            };
          }

          // Initialize period if it doesn't exist
          if (!commonSegments[segmentKey].periods[item.period]) {
            commonSegments[segmentKey].periods[item.period] = [];
          }

          // Add company data
          commonSegments[segmentKey].periods[item.period].push({
            company_name: item.company_name,
            value: segment.value,
          });
        });
      });
    });

    // Filter to keep only segments that appear in multiple companies
    const filteredSegments: any = {};

    Object.keys(commonSegments).forEach((segmentKey: string) => {
      const segment = commonSegments[segmentKey];

      // Check if this segment has data from multiple companies in at least one period
      const hasMultipleCompanies = Object.values(segment.periods).some(
        (companies: any) => {
          console.log(segment);

          if (
            companies.length > 1 &&
            !segment.segment_name.includes('revenue_consolidated')
          ) {
            return true;
          } else {
            return false;
          }
        }
      );

      if (hasMultipleCompanies) {
        filteredSegments[segmentKey] = segment;
      }
    });

    return filteredSegments;
  }

  generateCommonSegmentCharts(commonSegments: any) {
    const chartConfigs: any[] = [];

    // Color palette for companies
    const colorPalette = [
      '#3b82f6', // blue
      '#10b981', // green
      '#ef4444', // red
      '#f59e0b', // orange
      '#8b5cf6', // purple
      '#ec4899', // pink
    ];

    // Group data by period
    const periodGroups: any = {};

    Object.keys(commonSegments).forEach((segmentKey: string) => {
      const segment = commonSegments[segmentKey];

      Object.keys(segment.periods).forEach((period: string) => {
        if (!periodGroups[period]) {
          periodGroups[period] = {
            metric: segment.metric,
            segments: [],
          };
        }

        const companies = segment.periods[period];
        periodGroups[period].segments.push({
          segment_key: segmentKey,
          segment_name: segment.segment_name,
          companies: companies,
        });
      });
    });

    // Create chart for each period
    Object.keys(periodGroups).forEach((period: string) => {
      const periodData = periodGroups[period];
      const segments = periodData.segments;

      // Get all unique company names across all segments
      const companyNamesSet = new Set<string>();
      segments.forEach((seg: any) => {
        seg.companies.forEach((c: any) => companyNamesSet.add(c.company_name));
      });
      const companyNames = Array.from(companyNamesSet);

      // Segment names for x-axis
      const segmentNames = segments.map((s: any) =>
        snakeToTitleCase(s.segment_name)
      );

      // Create series for each company
      const series = companyNames.map(
        (companyName: string, companyIndex: number) => {
          const data = segments.map((seg: any) => {
            const companyData = seg.companies.find(
              (c: any) => c.company_name === companyName
            );
            return companyData ? companyData.value / 1000000 : 0; // Convert to millions
          });

          return {
            name: companyName,
            type: 'bar',
            data: data,
            barWidth: '140px',
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: colorPalette[companyIndex % colorPalette.length],
                  },
                  {
                    offset: 1,
                    color:
                      colorPalette[companyIndex % colorPalette.length] + 'cc',
                  },
                ],
              },
              borderRadius: [4, 4, 0, 0],
            },
            emphasis: {
              itemStyle: {
                color: colorPalette[companyIndex % colorPalette.length],
              },
            },
            label: {
              show: true,
              position: 'top',
              color: '#d7d7d7ff',
              fontSize: 10,
              formatter: (params: any) => {
                return params.value > 0 ? `$${params.value.toFixed(1)}M` : '';
              },
            },
          };
        }
      );

      const chartConfig = {
        title: {
          text: `${period}`,
          textStyle: {
            fontSize: 16,
            fontWeight: 600,
            color: '#d7d7d7ff',
          },
          left: 'center',
          top: 10,
        },

        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          backgroundColor: 'rgba(15, 15, 25, 0.95)',
          borderColor: 'rgba(100, 100, 150, 0.3)',
          borderWidth: 1,
          borderRadius: 12,
          padding: 12,
          textStyle: {
            color: '#d7d7d7ff',
            fontSize: 12,
            fontWeight: 'normal',
          },
          formatter: (params: any) => {
            const segmentName = params[0].name;
            let result = `<div style="font-weight: 600; margin-bottom: 8px; font-size: 14px;">${segmentName}</div>`;

            params.forEach((param: any) => {
              result += `
              <div style="display: flex; justify-content: space-between; align-items: center; margin: 6px 0;">
                <div style="display: flex; align-items: center; flex: 1;">
                  <span style="display: inline-block; width: 10px; height: 10px; background: ${
                    param.color
                  }; border-radius: 50%; margin-right: 8px;"></span>
                  <span>${param.seriesName}</span>
                </div>
                <div style="text-align: right; margin-left: 12px;">
                  <span style="font-weight: 600;">$${param.value.toFixed(
                    2
                  )}M</span>
                </div>
              </div>
            `;
            });

            return result;
          },
        },

        legend: {
          data: companyNames,
          bottom: 10,
          textStyle: {
            color: '#d7d7d7ff',
            fontSize: 11,
          },
          itemWidth: 12,
          itemHeight: 12,
        },

        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          top: '15%',
          containLabel: true,
        },

        xAxis: {
          type: 'category',
          data: segmentNames,
          axisLabel: {
            show: true,
            color: '#d7d7d7ff',
            fontSize: 11,
            interval: 0,
            rotate: segmentNames.length > 5 ? 45 : 0,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: 'rgba(100, 100, 150, 0.3)',
            },
          },
          axisTick: {
            show: false,
          },
        },

        yAxis: {
          type: 'value',
          axisLabel: {
            show: true,
            color: '#d7d7d7ff',
            fontSize: 11,
            formatter: (value: number) => `$${value}M`,
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(100, 100, 150, 0.1)',
              type: 'dashed',
            },
          },
        },

        backgroundColor: 'transparent',

        series: series,
      };

      chartConfigs.push({
        period: period,
        metric: periodData.metric,
        config: chartConfig,
      });
    });

    return chartConfigs;
  }

  generateCommonSegmentChartsBackup(commonSegments: any) {
    const chartConfigs: any[] = [];

    // Color palette for companies
    const colorPalette = [
      '#3b82f6', // blue
      '#10b981', // green
      '#ef4444', // red
      '#f59e0b', // orange
      '#8b5cf6', // purple
      '#ec4899', // pink
    ];

    Object.keys(commonSegments).forEach((segmentKey: string) => {
      const segment = commonSegments[segmentKey];

      Object.keys(segment.periods).forEach((period: string) => {
        const companies = segment.periods[period];

        // Extract company names and values
        const companyNames = companies.map((c: any) => c.company_name);
        const values = companies.map((c: any) => c.value / 1000000); // Convert to millions

        // Create series data with colors
        const seriesData = values.map((value: number, index: number) => ({
          value: value,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: colorPalette[index % colorPalette.length] },
                {
                  offset: 1,
                  color: colorPalette[index % colorPalette.length] + 'cc',
                },
              ],
            },
            borderRadius: 25,
          },
        }));

        const chartConfig = {
          tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            backgroundColor: 'rgba(15, 15, 25, 0.95)',
            borderColor: 'rgba(100, 100, 150, 0.3)',
            borderWidth: 1,
            borderRadius: 12,
            padding: 12,
            textStyle: {
              color: '#d7d7d7ff',
              fontSize: 12,
              fontWeight: 'normal',
            },
            formatter: (params: any) => {
              const param = params[0];
              return `
              <div style="font-weight: 600; margin-bottom: 4px;">${
                param.name
              }</div>
              <div style="font-weight: 600; color: #3b82f6;">$${param.value.toFixed(
                2
              )}M</div>
            `;
            },
          },

          grid: {
            left: '20%',
            right: '15%',
            top: '5%',
            bottom: '5%',
            containLabel: false,
          },

          xAxis: {
            type: 'value',
            show: false,
            axisLabel: { show: false },
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: { show: false },
          },

          yAxis: {
            type: 'category',
            data: companyNames,
            axisLabel: {
              show: true,

              color: (value: string, index: number) => {
                return colorPalette[index % colorPalette.length];
              },
              fontSize: 8,
              fontWeight: 'bold',
              interval: 0,
            },
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: { show: false },
          },

          backgroundColor: 'transparent',

          series: [
            {
              type: 'bar',
              data: seriesData,
              barWidth: '28px',
              barGap: '10%',
              barCategoryGap: '5px',
              label: {
                show: true,
                position: 'right',
                color: '#e0e0e0',
                fontSize: 14,
                fontWeight: 'bold',
                formatter: (params: any) => {
                  return `$${params.value.toFixed(1)}M`;
                },
              },
              emphasis: {
                itemStyle: {
                  opacity: 1,
                },
              },
            },
          ],
        };

        chartConfigs.push({
          segment_key: segmentKey,
          metric: segment.metric,
          segment_name: snakeToTitleCase(segment.segment_name),
          period: period,
          config: chartConfig,
        });
      });
    });

    return chartConfigs;
  }

  fetchMetricsForFormulaComponent() {
    if (this.API_DATA?.ANALYSIS_DATA?.results?.[0]?.statements.length == 0) {
      return null;
    }

    const metricsMap = new Map<
      string,
      {
        metric: string;
        value: number;
        metricViewName: string;
      }
    >();

    // Get the first company (or iterate all if you want combined data)
    const company = this.API_DATA.ANALYSIS_DATA.results[0];

    // Get latest quarter (assuming they're in chronological order)
    const latestQuarter = company.statements[company.statements.length - 1];

    // Extract metrics from latest quarter
    Object.entries(latestQuarter.all_metrics as Record<string, any>).forEach(
      ([metricKey, metricData]) => {
        metricsMap.set(metricKey, {
          metric: metricKey,
          value: metricData.value,
          metricViewName: metricData.name,
        });
      }
    );

    return Array.from(metricsMap.values());
  }

  convertResponseObject(input: any) {
    // Add safety check
    if (!input || typeof input !== 'object') {
      return {};
    }

    const result: any = {};

    // Recursively extract value and children structure
    const extractData = (obj: any): any => {
      const extracted: any = {
        value: obj?.value,
      };

      // If there are children, recursively process them
      if (obj?.children && typeof obj.children === 'object') {
        extracted.children = {};

        Object.entries(obj.children).forEach(([childKey, childObj]: any) => {
          // Skip if the key is "Consolidated"

          extracted.children[childKey] = extractData(childObj);
        });
      }

      return extracted;
    };
    Object.entries(input).forEach(([key, obj]: any) => {
      if (key != 'Consolidated') {
        result[key] = extractData(obj);
      }
    });

    return result;
  }

  fetchVerticalStackedBarChartData() {
    if (this.API_DATA.ANALYSIS_DATA) {
      let data: any[] = [];
      this.API_DATA.ANALYSIS_DATA.results.forEach((company: any) => {
        let companyData = {
          company: company?.company_name,
          quarters: <any[]>[],
        };

        company.statements.forEach((quarter: any) => {
          let filtredRequestedMetrics: any[] = [];
          this.API_DATA.PARSED_QUERY.metrics.forEach((metric: any) => {
            filtredRequestedMetrics.push({
              metricName: metric,
              total: quarter.all_metrics[metric]?.value,
              children: this.convertResponseObject(
                quarter.all_metrics[metric]?.children
              ),
            });
          });
          companyData.quarters.push({
            period: quarter?.context_info?.period_label_text,
            metrics: filtredRequestedMetrics,
          });
        });
        data.push(companyData);
      });
      return data;
    } else {
      return null;
    }
  }


  generateVerticalSegmentCharts(data: any[]) {
    const chartConfigs: any[] = [];

    // Color palette
    const colorPalette = [
      '#3b82f6', // blue
      '#10b981', // green
      '#ef4444', // red
      '#f59e0b', // orange
      '#8b5cf6', // purple
      '#ec4899', // pink
      '#06b6d4', // cyan
      '#84cc16', // lime
      '#fbbf24', // amber
      '#a78bfa', // violet
      '#fb7185', // rose
      '#34d399', // emerald
    ];

    // Helper function to darken a hex color
    function darkenColor(hex: string, percent: number = 20): string {
      const num = parseInt(hex.replace('#', ''), 16);
      const r = Math.max(0, ((num >> 16) & 0xff) * (1 - percent / 100));
      const g = Math.max(0, ((num >> 8) & 0xff) * (1 - percent / 100));
      const b = Math.max(0, (num & 0xff) * (1 - percent / 100));
      return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
    }

    // Helper function to recursively extract all leaf segments
    function extractLeafSegments(obj: any, path: string = ''): any[] {
      const segments: any[] = [];

      if (typeof obj !== 'object' || obj === null) {
        return segments;
      }

      // Get all keys except 'value'
      const childKeys = Object.keys(obj).filter((k) => k !== 'value');

      // If no children (or only 'value'), this is a leaf node
      if (childKeys.length === 0) {
        if (obj.value !== null && obj.value !== undefined) {
          return [
            {
              name: path,
              value: obj.value,
              path: path,
            },
          ];
        }
        return segments;
      }

      // Has children - recurse into each child
      childKeys.forEach((key) => {
        const child = obj[key];
        if (child !== null && child !== undefined) {
          const childPath = path ? `${path}.${key}` : key;
          const childSegments = extractLeafSegments(child, childPath);
          segments.push(...childSegments);
        }
      });

      return segments;
    }

    data.forEach((companyData: any) => {
      const companyName = companyData.company;

      companyData.quarters.forEach((quarterData: any) => {
        const period = quarterData.period;

        quarterData.metrics.forEach((metric: any) => {
          // Get root level keys (these will be the bars)
          const rootKeys = Object.keys(metric.children);
          const categories = rootKeys.map((key) => snakeToTitleCase(key));

          // Extract all leaf segments for each root bar
          const barSegments: any = {};
          const allSegmentNames = new Set<string>();

          rootKeys.forEach((rootKey) => {
            const rootItem = metric.children[rootKey];
            const leafSegments = extractLeafSegments(rootItem, rootKey);

            barSegments[rootKey] = leafSegments;

            // Add segment names to the set
            leafSegments.forEach((seg) => {
              // Use the last part of the path as the segment name for display
              const segmentDisplayName = seg.path.split('.').pop() || seg.name;
              allSegmentNames.add(segmentDisplayName);
            });
          });

          // Create a mapping of segment display names to their data
          const segmentNames = Array.from(allSegmentNames);
          const series: any[] = [];

          segmentNames.forEach((segmentName, index) => {
            const seriesData = rootKeys.map((rootKey) => {
              const segments = barSegments[rootKey];
              const segment = segments.find((s: any) => {
                const displayName = s.path.split('.').pop();
                return displayName === segmentName;
              });
              return segment ? segment.value / 1000000000 : 0;
            });

            // Calculate total for this segment across all categories
            const segmentTotal = seriesData.reduce(
              (sum, value) => sum + value,
              0
            );
            const displayName = snakeToTitleCase(segmentName);
            const legendName = `${displayName} ($${
              segmentTotal >= 0 ? '' : '-'
            }${Math.abs(segmentTotal).toFixed(2)}B)`;

            series.push({
              name: legendName,
              type: 'bar',
              stack: 'total',
              barWidth: '140px',
              stackStrategy: 'all',
              label: {
                show: false,
              },
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: colorPalette[index % colorPalette.length],
                    },
                    {
                      offset: 1,
                      color: colorPalette[index % colorPalette.length] + 'cc',
                    },
                  ],
                },
              },
              emphasis: {
                itemStyle: {
                  color: colorPalette[index % colorPalette.length],
                },
              },
              data: seriesData,
            });
          });

          const legendsMap = new Map<string, any>();

          // Calculate grand total across all segments
          const grandTotal = series.reduce((sum, s) => {
            return (
              sum +
              s.data.reduce(
                (dataSum: number, value: number) => dataSum + value,
                0
              )
            );
          }, 0);

          // Build hierarchy with colors matching the series
          segmentNames.forEach((segmentName, index) => {
            const segmentTotal = series[index].data.reduce(
              (sum: number, value: number) => sum + value,
              0
            );

            // Use the exact same color as the series
            const segmentColor = colorPalette[index % colorPalette.length];

            // Find the full path for this segment from barSegments
            let fullPath = '';
            for (const rootKey of rootKeys) {
              const segments = barSegments[rootKey];
              const segment = segments.find((s: any) => {
                const displayName = s.path.split('.').pop();
                return displayName === segmentName;
              });
              if (segment) {
                fullPath = segment.path;
                break;
              }
            }

            const pathParts = fullPath.split('.');
            const parentName = pathParts[0];

            if (pathParts.length === 1) {
              // Top-level segment with no parent
              if (!legendsMap.has(parentName)) {
                legendsMap.set(parentName, {
                  name: snakeToTitleCase(parentName),
                  color: segmentColor,
                  value: segmentTotal,
                  percentage:
                    grandTotal !== 0
                      ? parseFloat(
                          ((segmentTotal / grandTotal) * 100).toFixed(1)
                        )
                      : 0,
                  children: [],
                });
              }
            } else {
              // Child segment with parent
              const childName = pathParts[pathParts.length - 1];

              // Create parent if it doesn't exist
              if (!legendsMap.has(parentName)) {
                legendsMap.set(parentName, {
                  name: snakeToTitleCase(parentName),
                  color: colorPalette[0],
                  value: 0,
                  percentage: 0,
                  children: [],
                });
              }

              const parent = legendsMap.get(parentName);
              parent.value += segmentTotal;

              // Add child with the exact color from the series
              parent.children.push({
                name: snakeToTitleCase(childName),
                color: segmentColor,
                value: parseFloat(segmentTotal.toFixed(1)),
                percentage:
                  grandTotal !== 0
                    ? parseFloat(((segmentTotal / grandTotal) * 100).toFixed(1))
                    : 0,
              });
            }
          });

          // Update parent percentages and values after all children are added
          legendsMap.forEach((legend) => {
            if (legend.children.length > 0) {
              legend.value = parseFloat(legend.value.toFixed(1));
              legend.percentage =
                grandTotal !== 0
                  ? parseFloat(((legend.value / grandTotal) * 100).toFixed(1))
                  : 0;
            }
          });

          const legends = Array.from(legendsMap.values());

          const chartConfig = {
            useDirtyRect: true,
            devicePixelRatio: window.devicePixelRatio || 1,

            title: {
              text: ``,
              textStyle: {
                fontSize: 16,
                fontWeight: 600,
                color: '#d7d7d7ff',
              },
              left: 'center',
              top: 10,
            },

            tooltip: {
              trigger: 'item', // ✅ Changed from 'axis' to 'item'
              backgroundColor: 'rgba(15, 15, 25, 0.95)',
              borderColor: 'rgba(100, 100, 150, 0.3)',
              borderWidth: 1,
              borderRadius: 12,
              padding: 12,
              textStyle: {
                color: '#d7d7d7ff',
                fontSize: 12,
                fontWeight: 'normal',
              },
              formatter: (params: any) => {
                // ✅ Updated formatter for single item
                const categoryName = params.name;
                const seriesName = params.seriesName.split(' (')[0];
                const value = params.value;
                
                // Get all values in this category to calculate percentage
                const categoryIndex = params.dataIndex;
                const categoryTotal = series.reduce((sum, s) => {
                  return sum + (s.data[categoryIndex] || 0);
                }, 0);
                
                const percentage = categoryTotal !== 0 
                  ? (value / categoryTotal) * 100 
                  : 0;

                let result = `<div style="font-weight: 600; margin-bottom: 8px; font-size: 14px;">${categoryName}</div>`;
                
                result += `
                  <div style="display: flex; justify-content: space-between; align-items: center; margin: 6px 0;">
                    <div style="display: flex; align-items: center; flex: 1;">
                      <span style="display: inline-block; width: 10px; height: 10px; background: ${params.color}; border-radius: 50%; margin-right: 8px;"></span>
                      <span>${seriesName}</span>
                    </div>
                    <div style="text-align: right; margin-left: 12px;">
                      <span style="font-weight: 600;">${value >= 0 ? '$' : '-$'}${Math.abs(value).toFixed(2)}B</span>
                      <span style="color: #999; margin-left: 6px;">(${percentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                `;

                return result;
              },
            },

            legend: {
              data: legends.map((l) => l.name),
              bottom: 10,
              textStyle: {
                color: '#d7d7d7ff',
                fontSize: 11,
              },
              type: 'scroll',
              pageIconColor: '#d7d7d7ff',
              pageIconInactiveColor: 'rgba(100, 100, 150, 0.3)',
              pageTextStyle: {
                color: '#d7d7d7ff',
              },
            },

            grid: {
              left: '3%',
              right: '4%',
              bottom: '15%',
              top: '20%',
              containLabel: true,
            },

            xAxis: {
              type: 'category',
              data: categories,
              axisLabel: {
                show: true,
                color: '#d7d7d7ff',
                fontSize: 12,
                interval: 0,
              },
              axisLine: {
                show: true,
                lineStyle: {
                  color: 'rgba(100, 100, 150, 0.3)',
                },
              },
              axisTick: {
                show: false,
              },
            },

            yAxis: {
              type: 'value',
              show: false, // ✅ Hidden y-axis
              axisLabel: {
                show: false,
              },
              axisLine: {
                show: false,
              },
              axisTick: {
                show: false,
              },
              splitLine: {
                show: false,
              },
            },

            backgroundColor: 'transparent',

            series: series,
          };

          chartConfigs.push({
            company: companyName,
            period: period,
            total: parseFloat((metric.total / 1000000000).toFixed(1)),
            segments: barSegments,
            legends: {
              total: parseFloat((metric.total / 1000000000).toFixed(1)),
              legends: legends,
            },
            config: chartConfig,
            metric_name: metric.metricName,
          });
        });
      });
    });

    return chartConfigs;
  }

  

  fetchCustomCardsData(
    companies: { name: string; logo: string }[],
    customFormulaComponents: any[]
  ) {



    // Extract all unique keywords from all custom formulas as requested metrics
    const allKeywords = Array.from(
      new Set(customFormulaComponents.flatMap((formula) => formula.keywords))
    );

    const companyWiseCardData = this.API_DATA.ANALYSIS_DATA.results.map(
      (company: any) => {
        // Find matching company logo
        const matchedCompany = companies.find(
          (c) =>
            c.name
              .toLowerCase()
              .includes(
                this.formatCompanyName(company.company_name).toLowerCase()
              ) || c.name.toLowerCase() == company.company_name.toLowerCase()
        );
        const companyLogo = matchedCompany?.logo || '';

        return {
          company_name: company.company_name,
          cik: company.cik,
          logo: companyLogo,
          period: company?.statements?.context_info?.period_label_text,
          quarters: company.statements.map((qtr: any) => {
            // First, extract all keyword metrics from all_metrics
            const keywordMetrics: any = {};
            allKeywords.forEach((keyword: string) => {
              keywordMetrics[keyword] = qtr.all_metrics[keyword]; // Get raw metric data
            });

            // Then calculate each custom formula
            const calculatedMetrics: any = {};
            customFormulaComponents.forEach((formulaObj) => {
              const keywords = formulaObj.keywords;

              // Get values for this formula's keywords
              const keywordValues: { [key: string]: number } = {};
              let hasAllValues = true;

              keywords.forEach((keyword: string) => {
                const metricData = keywordMetrics[keyword];
                // Extract raw numeric value from the metric data
                const rawValue = this.getRawMetricValue(metricData);

                if (
                  rawValue !== null &&
                  rawValue !== undefined &&
                  !isNaN(rawValue)
                ) {
                  keywordValues[keyword] = rawValue;
                } else {
                  hasAllValues = false;
                }
              });

              // Calculate the formula result if all keyword values are available
              if (hasAllValues && keywords.length > 0) {
                const calculatedValue = this.evaluateFormula(
                  formulaObj.formula,
                  keywordValues
                );

                // Determine format type from formula or infer from keywords
                const formatType = this.determineFormatType(formulaObj, keywordMetrics, keywords);
                
                // Get appropriate prefix and postfix based on format type and value
                const formatting = this.getMetricFormatting(calculatedValue, formatType);

                calculatedMetrics[formulaObj.name] = {
                  value: calculatedValue,
                  trend: null, // Custom formulas don't have trend data
                  format_type: formatType,
                  prefix: formatting.prefix,
                  postfix: formatting.postfix,
                };
              } else {
                calculatedMetrics[formulaObj.name] = null;
              }
            });

            return {
              period: qtr.context_info.period_label_text,
              logo: companyLogo,
              metrics: calculatedMetrics,
            };
          }),
        };
      }
    );

    return this.populateCustomCardView(companyWiseCardData);
  }

  /**
   * Determine the format type for a calculated metric
   */
  private determineFormatType(
    formulaObj: any,
    keywordMetrics: any,
    keywords: string[]
  ): string {
    // First check if formula object has format_type specified
    if (formulaObj.format_type) {
      return formulaObj.format_type;
    }

    // Otherwise, infer from the first keyword metric that has format info
    for (const keyword of keywords) {
      const metricData = keywordMetrics[keyword];
      if (metricData && metricData.format_type) {
        return metricData.format_type;
      }
    }

    // Default to 'number' if no format type found
    return 'number';
  }

  /**
   * Get appropriate prefix and postfix based on value and format type
   */
  private getMetricFormatting(
    value: any,
    formatType: string
  ): { prefix: string; postfix: string } {
    let prefix = '';
    let postfix = '';

    const absValue = Math.abs(value);

    switch (formatType.toLowerCase()) {
      case 'currency':
        prefix = '$';
        // Determine scale based on value magnitude
        if (absValue >= 1_000_000_000) {
          postfix = 'B'; // Billions
        } else if (absValue >= 1_000_000) {
          postfix = 'M'; // Millions
        } else if (absValue >= 1_000) {
          postfix = 'K'; // Thousands
        }
        break;

      case 'percentage':
      case 'percent':
        postfix = '%';
        break;

      case 'ratio':
        postfix = 'x';
        break;

      case 'number':
        // For large numbers, add scale
        if (absValue >= 1_000_000_000) {
          postfix = 'B';
        } else if (absValue >= 1_000_000) {
          postfix = 'M';
        } else if (absValue >= 1_000) {
          postfix = 'K';
        }
        break;

      default:
        // No prefix or postfix for unknown types
        break;
    }

    return { prefix, postfix };
  }

  // Helper function to extract raw numeric value from metric data
  private getRawMetricValue(metricData: any): number | null {
    if (!metricData) return null;

    // Try different possible property names for the raw value
    if (typeof metricData === 'number') {
      return metricData;
    }

    if (metricData.raw_value !== undefined && metricData.raw_value !== null) {
      return parseFloat(metricData.raw_value);
    }

    if (metricData.value !== undefined && metricData.value !== null) {
      // If value is already a number, return it
      if (typeof metricData.value === 'number') {
        return metricData.value;
      }

      // If value is a string with units (like "22.51B"), parse it
      if (typeof metricData.value === 'string') {
        return this.parseFormattedValue(metricData.value);
      }
    }

    return null;
  }

  // Helper function to parse formatted values like "22.51B", "1.5M", etc.
  private parseFormattedValue(formattedValue: string): number | null {
    if (!formattedValue) return null;

    const value = formattedValue.toString().trim();

    // Remove any currency symbols
    const cleaned = value.replace(/[$,]/g, '');

    // Check for units
    const match = cleaned.match(/^(-?[\d.]+)([KMBT])?$/i);
    if (!match) return null;

    const number = parseFloat(match[1]);
    const unit = match[2]?.toUpperCase();

    if (isNaN(number)) return null;

    const multipliers: { [key: string]: number } = {
      K: 1000,
      M: 1000000,
      B: 1000000000,
      T: 1000000000000,
    };

    return unit ? number * multipliers[unit] : number;
  }

  // Helper function to evaluate formula with keyword values
  private evaluateFormula(
    formula: string,
    keywordValues: { [key: string]: number }
  ): number | null {
    try {
      let evaluableFormula = formula.trim();

      // Replace each keyword with its actual value
      Object.keys(keywordValues).forEach((keyword) => {
        const value = keywordValues[keyword];
        // Use word boundaries to ensure we replace whole words only
        evaluableFormula = evaluableFormula.replace(
          new RegExp(`\\b${keyword}\\b`, 'g'),
          value.toString()
        );
      });

      // Basic validation: ensure the formula only contains numbers, operators, and parentheses
      if (!/^[\d\s+\-*/().eE]+$/.test(evaluableFormula)) {
        console.error('Invalid formula after substitution:', evaluableFormula);
        return null;
      }

      // Evaluate the mathematical expression
      return eval(evaluableFormula);
    } catch (error) {
      console.error('Error evaluating formula:', error);
      return null;
    }
  }
}

function snakeToTitleCase(str: string): string {
  return str
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
