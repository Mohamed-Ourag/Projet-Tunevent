import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignTemplateComponent } from './design-template.component';

describe('DesignTemplateComponent', () => {
  let component: DesignTemplateComponent;
  let fixture: ComponentFixture<DesignTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DesignTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesignTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
