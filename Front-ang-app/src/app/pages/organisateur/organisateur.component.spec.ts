import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisateurComponent } from './organisateur.component';

describe('OrganisateurComponent', () => {
  let component: OrganisateurComponent;
  let fixture: ComponentFixture<OrganisateurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrganisateurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganisateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
