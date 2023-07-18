import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewInterviewsComponent } from './view-interviews.component';

describe('ViewInterviewsComponent', () => {
  let component: ViewInterviewsComponent;
  let fixture: ComponentFixture<ViewInterviewsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewInterviewsComponent]
    });
    fixture = TestBed.createComponent(ViewInterviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
