import { TestBed } from '@angular/core/testing';

import { InsuranceAnalyticsService } from './insurance-analytics.service';

describe('InsuranceAnalyticsService', () => {
  let service: InsuranceAnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InsuranceAnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
