import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegendDisplayComponent } from './legend-display.component';

describe('LegendDisplayComponent', () => {
  let component: LegendDisplayComponent;
  let fixture: ComponentFixture<LegendDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegendDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LegendDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
