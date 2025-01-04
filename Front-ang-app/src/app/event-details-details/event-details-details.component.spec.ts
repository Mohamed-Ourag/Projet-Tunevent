import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDetailsDetailsComponent } from './event-details-details.component';

describe('EventDetailsDetailsComponent', () => {
  let component: EventDetailsDetailsComponent;
  let fixture: ComponentFixture<EventDetailsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventDetailsDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventDetailsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
