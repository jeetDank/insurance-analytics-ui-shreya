import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightsCardComponent } from './insights-card.component';

describe('InsightsCardComponent', () => {
  let component: InsightsCardComponent;
  let fixture: ComponentFixture<InsightsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsightsCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsightsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
