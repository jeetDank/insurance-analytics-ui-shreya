import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelExportService {

  constructor() { }

  exportExcel(results: any[]) {
    
    
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
    this.downloadExcel(excelBuffer, this.getTimestampedFilename("financial_statement_"));
  }

  prepareMetadataSheet(results: any[]) {
  const data: any[] = [];
  
  // Add header
  data.push(['COMPANY METADATA']);
  data.push([]); // Empty row

  results.forEach((company, companyIndex) => {
    // Company header
    data.push([`Company ${companyIndex + 1}: ${company.company_name || 'N/A'}`]);
    data.push([]); // Empty row

    // Column headers
    data.push(['Metadata [Key]', 'Data']);

    // Company-level metadata
    this.addMetadataRow(data, 'CIK', company.cik);
    this.addMetadataRow(data, 'Company Name', company.company_name);
    this.addMetadataRow(data, 'Data Source', company.data_source);
    this.addMetadataRow(data, 'Extraction Date', company.extraction_date);

    data.push([]); // Empty row

    // Statement-level metadata
    if (company.statements && company.statements.length > 0) {
      data.push(['FILING METADATA']);
      data.push([]); // Empty row

      company.statements.forEach((statement: any, stmtIndex: number) => {
        const metadata = statement.metadata || {};

        // Statement header
        data.push([`Statement #${stmtIndex + 1}`]);
        data.push([]); // Empty row

        // Column headers for each statement
        data.push(['Metadata', 'Data']);

        // Add all metadata fields
        this.addMetadataRow(data, 'CIK', metadata.cik);
        this.addMetadataRow(data, 'Company Name', metadata.company_name);
        this.addMetadataRow(data, 'Filing Type', metadata.filing_type);
        this.addMetadataRow(data, 'Filing Date', metadata.filing_date);
        this.addMetadataRow(data, 'Period End Date', metadata.period_end_date);
        this.addMetadataRow(data, 'Accession Number', metadata.accession_number);
        this.addMetadataRow(data, 'Filing URL', metadata.filing_url);
        this.addMetadataRow(data, 'HTML URL', metadata.html_url);
        this.addMetadataRow(data, 'XML URL', metadata.xml_url);
        this.addMetadataRow(data, 'SEC EDGAR URL', metadata.sec_edgar_url);
        this.addMetadataRow(data, 'XBRL JSON URL', metadata.xbrl_json_url);
        this.addMetadataRow(data, 'Fiscal Year', metadata.fiscal_year);
        this.addMetadataRow(data, 'Fiscal Quarter', metadata.fiscal_quarter);
        this.addMetadataRow(data, 'Fiscal Period Type', metadata.fiscal_period_type);
        this.addMetadataRow(data, 'Submission Type', metadata.submission_type);
        this.addMetadataRow(data, 'Document Format Code', metadata.document_format_code);
        this.addMetadataRow(data, 'Logo URL', metadata.logo_url);

        data.push([]); // Empty row
        data.push(['─'.repeat(30)]); // Separator
        data.push([]); // Empty row
      });
    }

    // Add spacing between companies
    data.push([]);
    data.push(['═'.repeat(50)]); // Stronger separator
    data.push([]);
  });

  return data;
}

// Helper method to add metadata row only if value exists
private addMetadataRow(data: any[], key: string, value: any): void {
  if (value !== null && value !== undefined && value !== '') {
    data.push([key, value]);
  }
}

private getTimestampedFilename(baseName: string = 'financial_statements'): string {
  const now = new Date();
  
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  // Format: financial_statements_2024-12-26_14-30-45.xlsx
  return `${baseName}_${year}-${month}-${day}_${hours}-${minutes}-${seconds}.xlsx`;
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

    // Process each statement
    company.statements.forEach((statement: any, stmtIndex: number) => {
      const period = statement.metadata?.period_end_date || 
                    statement.metadata?.filing_date || 
                    statement.quarter || 
                    statement.period || 
                    `Statement ${stmtIndex + 1}`;
      
      // Statement header
      data.push([`Period: ${period}`]);
      data.push([]); // Empty row

      // Add column headers
      data.push(['Metric Name', 'Value']);

      if (statement.all_metrics) {
        // Iterate through each metric
        Object.entries(statement.all_metrics).forEach(([metricName, metricData]: [string, any]) => {
          
          // Skip if metric data is null, undefined, or empty
          if (metricData === null || metricData === undefined) {
            return;
          }

          // Handle object metrics (with multiple fields)
          if (typeof metricData === 'object' && !Array.isArray(metricData)) {
            Object.entries(metricData).forEach(([field, value]: [string, any]) => {
              // Skip if value is null, undefined, or empty string
              if (value !== null && value !== undefined && value !== '') {
                const formattedValue = typeof value === 'number' 
                  ? value 
                  : value;
                data.push([`${metricName} - ${field}`, formattedValue]);
              }
            });
          } 
          // Handle primitive metrics (direct values)
          else if (metricData !== '') {
            const formattedValue = typeof metricData === 'number' 
              ? metricData 
              : metricData;
            data.push([metricName, formattedValue]);
          }
        });
      } else {
        data.push(['No metrics available', 'N/A']);
      }

      // Add spacing between statements
      data.push([]);
      data.push(['─'.repeat(30)]); // Separator
      data.push([]);
    });

    // Add spacing between companies
    data.push([]);
    data.push(['═'.repeat(50)]); // Stronger separator
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