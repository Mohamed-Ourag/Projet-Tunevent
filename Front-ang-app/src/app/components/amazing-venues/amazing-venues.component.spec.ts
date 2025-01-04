import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmazingVenuesComponent } from './amazing-venues.component';

describe('AmazingVenuesComponent', () => {
  let component: AmazingVenuesComponent;
  let fixture: ComponentFixture<AmazingVenuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AmazingVenuesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmazingVenuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
