import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelExportService {

  constructor() { }

  exportExcel(results: any[]) {
    console.log(results);
    
    const workbook = XLSX.utils.book_new();

    // Create Metadata Sheet
    const metadataSheet = this.prepareMetadataSheet(results);
    const metadataWorksheet = XLSX.utils.aoa_to_sheet(metadataSheet);
    XLSX.utils.book_append_sheet(workbook, metadataWorksheet, 'Metadata');

    // Create Metrics Sheet
    const metricsSheet = this.prepareMetricsSheet(results);
    const metricsWorksheet = XLSX.utils.aoa_to_sheet(metricsSheet);
    XLSX.utils.book_append_sheet(workbook, metricsWorksheet, 'Metrics');

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    
    // Download file
    this.downloadExcel(excelBuffer, 'financial_statements.xlsx');
  }

  prepareMetadataSheet(results: any[]) {
    const data: any[] = [];
    
    // Add header
    data.push(['COMPANY METADATA']);
    data.push([]); // Empty row

    results.forEach((company, companyIndex) => {
      // Company-level metadata
      data.push([`Company ${companyIndex + 1}`]);
      data.push(['CIK', company.cik || 'N/A']);
      data.push(['Company Name', company.company_name || 'N/A']);
      data.push(['Data Source', company.data_source || 'N/A']);
      data.push(['Extraction Date', company.extraction_date || 'N/A']);
      data.push([]); // Empty row

      // Statement-level metadata
      if (company.statements && company.statements.length > 0) {
        data.push(['FILING METADATA']);
        data.push([]);

        // Header for statement metadata
        data.push([
          'Statement #',
          'CIK',
          'Company Name',
          'Filing Type',
          'Filing Date',
          'Period End Date',
          'Accession Number',
          'Filing URL',
          'HTML URL',
          'XML URL',
          'SEC EDGAR URL',
          'XBRL JSON URL',
          'Fiscal Year',
          'Fiscal Quarter',
          'Fiscal Period Type',
          'Submission Type',
          'Document Format Code',
          'Logo URL'
        ]);

        company.statements.forEach((statement: any, stmtIndex: number) => {
          const metadata = statement.metadata || {};
          data.push([
            stmtIndex + 1,
            metadata.cik || 'N/A',
            metadata.company_name || 'N/A',
            metadata.filing_type || 'N/A',
            metadata.filing_date || 'N/A',
            metadata.period_end_date || 'N/A',
            metadata.accession_number || 'N/A',
            metadata.filing_url || 'N/A',
            metadata.html_url || 'N/A',
            metadata.xml_url || 'N/A',
            metadata.sec_edgar_url || 'N/A',
            metadata.xbrl_json_url || 'N/A',
            metadata.fiscal_year || 'N/A',
            metadata.fiscal_quarter || 'N/A',
            metadata.fiscal_period_type || 'N/A',
            metadata.submission_type || 'N/A',
            metadata.document_format_code || 'N/A',
            metadata.logo_url || 'N/A'
          ]);
        });

        data.push([]); // Empty row
      }

      data.push([]); // Empty row between companies
      data.push(['─'.repeat(50)]); // Separator
      data.push([]); // Empty row
    });

    return data;
  }

  prepareMetricsSheet(results: any[]) {
    const data: any[] = [];
    
    // Add header
    data.push(['COMPANY METRICS']);
    data.push([]); // Empty row

    results.forEach((company, companyIndex) => {
      // Company header
      data.push([`Company: ${company.company_name || 'N/A'} (CIK: ${company.cik || 'N/A'})`]);
      data.push([]); // Empty row

      if (!company.statements || company.statements.length === 0) {
        data.push(['No statements available']);
        data.push([]);
        return;
      }

      // Collect all unique metrics and their fields
      const allMetrics = new Map<string, Set<string>>();
      
      company.statements.forEach((statement: any) => {
        if (statement.all_metrics) {
          Object.entries(statement.all_metrics).forEach(([metricName, metricData]: [string, any]) => {
            if (!allMetrics.has(metricName)) {
              allMetrics.set(metricName, new Set());
            }
            
            // Collect all fields for this metric
            if (typeof metricData === 'object' && metricData !== null) {
              Object.keys(metricData).forEach(field => {
                allMetrics.get(metricName)?.add(field);
              });
            }
          });
        }
      });

      // Create header row
      const headerRow = ['Period/Quarter'];
      allMetrics.forEach((fields, metricName) => {
        fields.forEach(field => {
          headerRow.push(`${metricName} - ${field}`);
        });
      });
      data.push(headerRow);

      // Add data rows for each statement
      company.statements.forEach((statement: any, stmtIndex: number) => {
        const period = statement.metadata?.period_end_date || 
                      statement.metadata?.filing_date || 
                      statement.quarter || 
                      statement.period || 
                      `Statement ${stmtIndex + 1}`;
        
        const row = [period];

        allMetrics.forEach((fields, metricName) => {
          const metricData = statement.all_metrics?.[metricName];
          
          fields.forEach(field => {
            if (metricData && typeof metricData === 'object' && metricData[field] !== undefined) {
              // Format numbers properly
              const value = metricData[field];
              if (typeof value === 'number') {
                row.push(value);
              } else {
                row.push(value !== null ? value : 'N/A');
              }
            } else if (typeof metricData !== 'object') {
              // If metric is a primitive value
              row.push(metricData !== undefined ? metricData : 'N/A');
            } else {
              row.push('N/A');
            }
          });
        });

        data.push(row);
      });

      // Add spacing between companies
      data.push([]);
      data.push(['─'.repeat(50)]); // Separator
      data.push([]);
    });

    return data;
  }

  downloadExcel(buffer: any, filename: string) {
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }
}