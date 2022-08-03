import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineItemDetailsComponent } from './online-item-details.component';

describe('OnlineItemDetailsComponent', () => {
  let component: OnlineItemDetailsComponent;
  let fixture: ComponentFixture<OnlineItemDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnlineItemDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnlineItemDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
