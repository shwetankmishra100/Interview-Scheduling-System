import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewSchedulerComponent } from './interview-scheduler.component';

describe('InterviewSchedulerComponent', () => {
  let component: InterviewSchedulerComponent;
  let fixture: ComponentFixture<InterviewSchedulerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InterviewSchedulerComponent]
    });
    fixture = TestBed.createComponent(InterviewSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
