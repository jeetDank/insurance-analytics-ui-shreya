import { Injectable } from '@angular/core';

interface apiData {
  PARSED_QUERY: any | null;
  COMPANY_DATA: any[] | null;
  ANALYSIS_DATA: any | null;
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
      return payload
    } else {
      return false;
    }
  }
}
