import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMetricComponent } from './add-metric.component';

describe('AddMetricComponent', () => {
  let component: AddMetricComponent;
  let fixture: ComponentFixture<AddMetricComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMetricComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMetricComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
