import { Injectable } from '@angular/core';
import { ECharts } from 'echarts/core';

interface apiData {
  PARSED_QUERY: any | null;
  COMPANY_DATA: any[] | null;
  ANALYSIS_DATA: any | null;
  AMBIGUITY_DATA: any | null;
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
  };

  setParsedQuery(data: any) {
    this.API_DATA.PARSED_QUERY = data;
  }
  setCompanyData(data: any) {
    this.API_DATA.COMPANY_DATA = data;
  }
  setAnalysisData(data: any) {
    this.API_DATA.ANALYSIS_DATA = data;
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

      payload.companies = this.API_DATA.COMPANY_DATA.map((data) => {
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

  fetchAmbiguities() {
    if (this.API_DATA.PARSED_QUERY) {
      let ambiguityData = this.API_DATA.PARSED_QUERY.ambiguities.map(
        (ambiguity: any) => {
          return {
            metric_name: ambiguity.name,
            context: 'string',
            suggestions: ambiguity.suggestions,
            resolution_type: 'select',
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
      let payload = {
        companies: [
          {
            cik: '0000002969',
            company_name: 'Allstate Corporation',
            period: 'Q1 2023',
            requested_metrics: ['net_income', 'revenue'],
            analysis_result: {
              metrics: {
                revenue: {
                  name: 'revenue',
                  value: 13852000000,
                  concept: 'revenue',
                  unit: 'USD',
                },
                net_income: {
                  name: 'net_income',
                  value: -340000000,
                  concept: 'netincomeloss',
                  unit: 'USD',
                },
              },
              metadata: {
                cik: '0000002969',
                company_name: 'ALLSTATE CORP',
                filing_type: '10-Q',
                filing_date: '2023-05-04',
                period_end_date: '2023-03-31',
                accession_number: '0000002969-23-000016',
                filing_url:
                  'https://www.sec.gov/Archives/edgar/data/2969/000000296923000016/all-20230331.htm',
                html_url:
                  'https://www.sec.gov/Archives/edgar/data/2969/000000296923000016/all-20230331.htm',
                xml_url:
                  'https://www.sec.gov/Archives/edgar/data/2969/000000296923000016/all-20230331_htm.xml',
                sec_edgar_url:
                  'https://www.sec.gov/Archives/edgar/data/2969/0000002969-23-000016-index.html',
                xbrl_json_url:
                  'https://data.sec.gov/api/xbrl/companyfacts/CIK0000002969.json',
                fiscal_year: 2023,
                fiscal_quarter: 1,
                fiscal_period_type: 'Q1',
                submission_type: '10-Q',
                document_format_code: '10-Q',
              },
              context_info: {
                context_id: 'period_2023-03-31',
                entity_identifier: '0000002969',
                period_type: 'duration',
                end_date: '2023-03-31',
                fiscal_year: 2023,
                fiscal_quarter: 1,
                start_date: '2023-01-01',
                context_ref: 'instant_2023-03-31',
                duration_days: 90,
                is_consolidated: true,
              },
            },
          },
          {
            cik: '0000002969',
            company_name: 'Allstate Corporation',
            period: 'Q2 2023',
            requested_metrics: ['net_income', 'revenue'],
            analysis_result: {
              metrics: {
                revenue: {
                  name: 'revenue',
                  value: 14478000000,
                  concept: 'revenue',
                  unit: 'USD',
                },
                net_income: {
                  name: 'net_income',
                  value: -1400000000,
                  concept: 'netincomeloss',
                  unit: 'USD',
                },
              },
              metadata: {
                cik: '0000002969',
                company_name: 'ALLSTATE CORP',
                filing_type: '10-Q',
                filing_date: '2023-08-03',
                period_end_date: '2023-06-30',
                accession_number: '0000002969-23-000027',
                filing_url:
                  'https://www.sec.gov/Archives/edgar/data/2969/000000296923000027/all-20230630.htm',
                html_url:
                  'https://www.sec.gov/Archives/edgar/data/2969/000000296923000027/all-20230630.htm',
                xml_url:
                  'https://www.sec.gov/Archives/edgar/data/2969/000000296923000027/all-20230630_htm.xml',
                sec_edgar_url:
                  'https://www.sec.gov/Archives/edgar/data/2969/0000002969-23-000027-index.html',
                xbrl_json_url:
                  'https://data.sec.gov/api/xbrl/companyfacts/CIK0000002969.json',
                fiscal_year: 2023,
                fiscal_quarter: 2,
                fiscal_period_type: 'Q2',
                submission_type: '10-Q',
                document_format_code: '10-Q',
              },
              context_info: {
                context_id: 'period_2023-06-30',
                entity_identifier: '0000002969',
                period_type: 'duration',
                end_date: '2023-06-30',
                fiscal_year: 2023,
                fiscal_quarter: 2,
                start_date: '2023-04-01',
                context_ref: 'instant_2023-06-30',
                duration_days: 91,
                is_consolidated: true,
              },
            },
          },
          {
            cik: '00000086321',
            company_name: 'Travelers Companies Inc',
            period: 'Q1 2023',
            requested_metrics: ['net_income', 'revenue', 'etc'],
            analysis_result: {
              metrics: {
                revenue: {
                  name: 'revenue',
                  value: 9855000000,
                  concept: 'revenue',
                  unit: 'USD',
                },
                net_income: {
                  name: 'net_income',
                  value: 975000000,
                  concept: 'netincomeloss',
                  unit: 'USD',
                },
              },
              metadata: {
                cik: '00000086321',
                company_name: 'TRAVELERS COS INC',
                filing_type: '10-Q',
                filing_date: '2023-04-20',
                period_end_date: '2023-03-31',
                accession_number: '00000086321-23-000008',
                filing_url:
                  'https://www.sec.gov/Archives/edgar/data/86321/0000008632123000008/trav-20230331.htm',
                html_url:
                  'https://www.sec.gov/Archives/edgar/data/86321/0000008632123000008/trav-20230331.htm',
                xml_url:
                  'https://www.sec.gov/Archives/edgar/data/86321/0000008632123000008/trav-20230331_htm.xml',
                sec_edgar_url:
                  'https://www.sec.gov/Archives/edgar/data/86321/00000086321-23-000008-index.html',
                xbrl_json_url:
                  'https://data.sec.gov/api/xbrl/companyfacts/CIK00000086321.json',
                fiscal_year: 2023,
                fiscal_quarter: 1,
                fiscal_period_type: 'Q1',
                submission_type: '10-Q',
                document_format_code: '10-Q',
              },
              context_info: {
                context_id: 'period_2023-03-31',
                entity_identifier: '00000086321',
                period_type: 'duration',
                end_date: '2023-03-31',
                fiscal_year: 2023,
                fiscal_quarter: 1,
                start_date: '2023-01-01',
                context_ref: 'instant_2023-03-31',
                duration_days: 90,
                is_consolidated: true,
              },
            },
          },
          {
            cik: '00000086321',
            company_name: 'Travelers Companies Inc',
            period: 'Q2 2023',
            requested_metrics: ['net_income', 'revenue'],
            analysis_result: {
              metrics: {
                revenue: {
                  name: 'revenue',
                  value: 10135000000,
                  concept: 'revenue',
                  unit: 'USD',
                },
                net_income: {
                  name: 'net_income',
                  value: -150000000,
                  concept: 'netincomeloss',
                  unit: 'USD',
                },
              },
              metadata: {
                cik: '00000086321',
                company_name: 'TRAVELERS COS INC',
                filing_type: '10-Q',
                filing_date: '2023-07-20',
                period_end_date: '2023-06-30',
                accession_number: '00000086321-23-000015',
                filing_url:
                  'https://www.sec.gov/Archives/edgar/data/86321/0000008632123000015/trav-20230630.htm',
                html_url:
                  'https://www.sec.gov/Archives/edgar/data/86321/0000008632123000015/trav-20230630.htm',
                xml_url:
                  'https://www.sec.gov/Archives/edgar/data/86321/0000008632123000015/trav-20230630_htm.xml',
                sec_edgar_url:
                  'https://www.sec.gov/Archives/edgar/data/86321/00000086321-23-000015-index.html',
                xbrl_json_url:
                  'https://data.sec.gov/api/xbrl/companyfacts/CIK00000086321.json',
                fiscal_year: 2023,
                fiscal_quarter: 2,
                fiscal_period_type: 'Q2',
                submission_type: '10-Q',
                document_format_code: '10-Q',
              },
              context_info: {
                context_id: 'period_2023-06-30',
                entity_identifier: '00000086321',
                period_type: 'duration',
                end_date: '2023-06-30',
                fiscal_year: 2023,
                fiscal_quarter: 2,
                start_date: '2023-04-01',
                context_ref: 'instant_2023-06-30',
                duration_days: 91,
                is_consolidated: true,
              },
            },
          },
          {
            cik: '0000080661',
            company_name: 'Progressive Corporation',
            period: 'Q1 2024',
            requested_metrics: ['revenue'],
            analysis_result: {
              metrics: {
                revenue: {
                  name: 'revenue',
                  value: 17242500000,
                  concept: 'revenue',
                  unit: 'USD',
                },
              },
              metadata: {
                cik: '0000080661',
                company_name: 'PROGRESSIVE CORP/OH/',
                filing_type: '10-Q',
                filing_date: '2024-05-06',
                period_end_date: '2024-03-31',
                accession_number: '0000080661-24-000018',
                filing_url:
                  'https://www.sec.gov/Archives/edgar/data/80661/000008066124000018/pgr-20240331.htm',
                html_url:
                  'https://www.sec.gov/Archives/edgar/data/80661/000008066124000018/pgr-20240331.htm',
                xml_url:
                  'https://www.sec.gov/Archives/edgar/data/80661/000008066124000018/pgr-20240331_htm.xml',
                sec_edgar_url:
                  'https://www.sec.gov/Archives/edgar/data/80661/0000080661-24-000018-index.html',
                xbrl_json_url:
                  'https://data.sec.gov/api/xbrl/companyfacts/CIK0000080661.json',
                fiscal_year: null,
                fiscal_quarter: null,
                fiscal_period_type: null,
                submission_type: null,
                document_format_code: null,
              },
              context_info: {
                context_id: 'period_2024-03-31',
                entity_identifier: '0000080661',
                period_type: 'duration',
                end_date: '2024-03-31',
                fiscal_year: null,
                fiscal_quarter: null,
                start_date: null,
                context_ref: 'instant_2024-03-31',
                duration_days: null,
                is_consolidated: true,
              },
            },
          },
        ],
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
  fetchCardsData() {
    const requested_metrics = this.API_DATA.PARSED_QUERY.metrics;

    const companyWiseCardData = this.API_DATA.ANALYSIS_DATA.results.map(
      (company: any) => ({
        company_name: company.company_name,
        cik: company.cik,
        period: company?.statements?.context_info?.period_label_text,
        quarters: company.statements.map((qtr: any) => ({
          period: qtr.context_info.period_label_text,
          metrics: requested_metrics.reduce((acc: any, metric: any) => {
            acc[metric] = this.extractMetricData(qtr.all_metrics[metric]);
            return acc;
          }, {}),
        })),
      })
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
    const trend = this.calculateTrend(metricData);

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

  private calculateTrend(metricData: any): string {
    // Priority: YoY > QoQ
    if (
      metricData.yoy_growth_rate !== null &&
      metricData.yoy_growth_rate !== undefined
    ) {
      return this.formatTrend(metricData.yoy_growth_rate, 'YoY');
    }

    if (
      metricData.qoq_growth_rate !== null &&
      metricData.qoq_growth_rate !== undefined
    ) {
      return this.formatTrend(metricData.qoq_growth_rate, 'QoQ');
    }

    return 'N/A';
  }

  private formatTrend(growthRate: number, period: string): string {
    const percentage = (growthRate * 100).toFixed(2);
    const sign = growthRate >= 0 ? '+' : '';
    return `${sign}${percentage}% ${period}`;
  }

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
            trend: this.formatTrendData(
              metricData?.trend,
              metricData?.currency
            ),
          };
        });
      }),
    }));
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
        shadowHover: 'rgba(52, 152, 219, 0.7)'
      },
      {
        base: 'rgba(231, 76, 60, 0.95)',
        end: 'rgba(192, 57, 43, 0.8)',
        shadow: 'rgba(231, 76, 60, 0.4)',
        shadowHover: 'rgba(231, 76, 60, 0.7)'
      },
      {
        base: 'rgba(46, 204, 113, 0.95)',
        end: 'rgba(39, 174, 96, 0.8)',
        shadow: 'rgba(46, 204, 113, 0.4)',
        shadowHover: 'rgba(46, 204, 113, 0.7)'
      },
      {
        base: 'rgba(243, 156, 18, 0.95)',
        end: 'rgba(211, 84, 0, 0.8)',
        shadow: 'rgba(243, 156, 18, 0.4)',
        shadowHover: 'rgba(243, 156, 18, 0.7)'
      },
      {
        base: 'rgba(155, 89, 182, 0.95)',
        end: 'rgba(142, 68, 173, 0.8)',
        shadow: 'rgba(155, 89, 182, 0.4)',
        shadowHover: 'rgba(155, 89, 182, 0.7)'
      }
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
      shadowHover: colorSet.shadowHover
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
    cards.forEach(card => periodsSet.add(card.period));
    
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
  function parseMetricValue(metricStr: string): { value: number; unit: string } {
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
        unit: '%'
      };
    } else if (sampleMetric.includes('B') || sampleMetric.includes('M')) {
      return {
        formatter: (value: number) => `$${value.toFixed(2)}B`,
        unit: 'B'
      };
    }
    return {
      formatter: (value: number) => value.toFixed(2),
      unit: ''
    };
  }
  
  // Process each metric
  metricsData.forEach(metric => {
    // Extract and sort periods dynamically
    const periods = extractAndSortPeriods(metric.cards);
    
    // Get Y-axis formatter based on metric type
    const yAxisConfig = getYAxisFormatter(metric.cards);
    
    // Group data by company
    const companiesData: { [key: string]: (number | null)[] } = {};
    const companiesSet = new Set<string>();
    
    // Collect all unique companies
    metric.cards.forEach((card:any) => {
      companiesSet.add(card.companyName);
    });
    
    // Initialize data arrays for each company
    const companies = Array.from(companiesSet);
    companies.forEach(company => {
      companiesData[company] = new Array(periods.length).fill(null);
    });
    
    // Fill in the data
    metric.cards.forEach((card:any) => {
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
          shadowOffsetY: 3
        },
        itemStyle: {
          color: color,
          borderWidth: 2,
          borderColor: '#1a1a2e'
        },
        data: companiesData[company]
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
        data: companiesData[company]
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
          fontWeight: 'normal'
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
        }
      },
      
      legend: {
        data: companies,
        bottom: 10,
        textStyle: {
          fontSize: 13,
          color: '#b0b0ff',
          fontWeight: '500'
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
          fontWeight: '500'
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: 'rgba(160, 160, 255, 0.4)',
            width: 1.5
          }
        },
        splitLine: { show: false },
      },
      
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: yAxisConfig.formatter,
          fontSize: 12,
          color: '#c0c0ff',
          fontWeight: '500'
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: 'rgba(160, 160, 255, 0.4)',
            width: 1.5
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: 'rgba(80, 80, 120, 0.2)',
            type: 'dashed',
            width: 1
          }
        },
      },
      
      backgroundColor: 'transparent',
      
      series: lineSeries
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
        }
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
      
      series: barSeries
    };
    
    // Add to results
    results.push({
      metric_name: metric.metricName,
      line_chart_config: lineChartConfig,
      bar_chart_config: barChartConfig
    });
  });
  
  return results;
}

  
}
