import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuaryBoxComponent } from './quary-box.component';

describe('QuaryBoxComponent', () => {
  let component: QuaryBoxComponent;
  let fixture: ComponentFixture<QuaryBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuaryBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuaryBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
