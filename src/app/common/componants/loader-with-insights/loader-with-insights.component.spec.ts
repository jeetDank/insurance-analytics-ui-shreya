import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderWithInsightsComponent } from './loader-with-insights.component';

describe('LoaderWithInsightsComponent', () => {
  let component: LoaderWithInsightsComponent;
  let fixture: ComponentFixture<LoaderWithInsightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoaderWithInsightsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoaderWithInsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
