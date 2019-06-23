import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitEventComponent } from './submit-event.component';

describe('SubmitEventComponent', () => {
  let component: SubmitEventComponent;
  let fixture: ComponentFixture<SubmitEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
