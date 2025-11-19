import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricTableComponent } from './metric-table.component';

describe('MetricTableComponent', () => {
  let component: MetricTableComponent;
  let fixture: ComponentFixture<MetricTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetricTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetricTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
