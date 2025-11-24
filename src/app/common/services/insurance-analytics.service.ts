import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS as apis } from '../constants/API_ENDPOINTS';
import { BASE_URL } from '../constants/API_ENDPOINTS';

interface multipleCompanies {
  company_inputs: string[];
}

interface ambiguityResolve {
  metric_name: string;
  context: string;
  suggestions: string[];
  resolution_type: string;
}

interface batchAnalysis {
  companies: companies[];
  time_periods: string[];
  filing_type: string;
  analysis_depth: number;
}

interface companies {
  cik: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class InsuranceAnalyticsService {
  constructor(private http: HttpClient) {}

  parseQuery(payload: { query: string }): Observable<any> {
    return this.http.post(BASE_URL + apis.PARSE_QUERY, payload);
  }

  resolveMultipleCompanies(payload: multipleCompanies): Observable<any> {
    return this.http.post(BASE_URL + apis.COMPANY_RESOLVE_MULTIPLE, payload);
  }

  resolveAmbiguities(payload: ambiguityResolve): Observable<any> {
    return this.http.post(BASE_URL + apis.AMBIGUITY_RESOLVE, payload);
  }

  batchAnalysis(payload: batchAnalysis) {
    return this.http.post(BASE_URL + apis.BATCH_ANALYSIS, payload);
  }
}
