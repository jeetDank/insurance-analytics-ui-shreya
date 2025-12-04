import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmbiguityResolverComponent } from './ambiguity-resolver.component';

describe('AmbiguityResolverComponent', () => {
  let component: AmbiguityResolverComponent;
  let fixture: ComponentFixture<AmbiguityResolverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmbiguityResolverComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmbiguityResolverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
