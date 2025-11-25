import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor() {}

  API_DATA = {
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





}
