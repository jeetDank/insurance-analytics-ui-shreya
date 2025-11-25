// API Base URLs
export const API_BASE_URLS = {
  DEVELOPMENT: 'http://localhost:8000/api/v1',
  STAGING: 'http://localhost:8000/api/v1',
  PRODUCTION: 'http://localhost:8000/api/v1',
} as const;

// Current environment base URL

export const BASE_URL = API_BASE_URLS.DEVELOPMENT;

// Authentication Endpoints
export const API_ENDPOINTS = {
  PARSE_QUERY: '/query/parse',

  COMPANY_RESOLVE: '/companies/resolve',

  COMPANY_RESOLVE_MULTIPLE: '/companies/resolvemultiples',

  AMBIGUITY_RESOLVE: '/ambiguities/resolve',

  BATCH_ANALYSIS: '/analysis/batch',

  VARIANCE_ANALYSIS: '/analysis/variance',

  VARIANCE_ANALYSIS_LIGHT: '/analysis/variance-lightweight',

  FETCH_FORMULAS: '/formulas_list/formulas',
} as const;
