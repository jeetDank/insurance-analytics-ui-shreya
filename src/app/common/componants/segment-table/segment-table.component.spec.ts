import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SegmentTableComponent } from './segment-table.component';

describe('SegmentTableComponent', () => {
  let component: SegmentTableComponent;
  let fixture: ComponentFixture<SegmentTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SegmentTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SegmentTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
