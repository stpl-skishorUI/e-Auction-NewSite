import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EauctionEventComponent } from './eauction-event.component';

describe('EauctionEventComponent', () => {
  let component: EauctionEventComponent;
  let fixture: ComponentFixture<EauctionEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EauctionEventComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EauctionEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
