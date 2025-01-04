import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentVenueComponent } from './rent-venue.component';

describe('RentVenueComponent', () => {
  let component: RentVenueComponent;
  let fixture: ComponentFixture<RentVenueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RentVenueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentVenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
