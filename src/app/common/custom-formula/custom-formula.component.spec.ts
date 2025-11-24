import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomFormulaComponent } from './custom-formula.component';

describe('CustomFormulaComponent', () => {
  let component: CustomFormulaComponent;
  let fixture: ComponentFixture<CustomFormulaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomFormulaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomFormulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
