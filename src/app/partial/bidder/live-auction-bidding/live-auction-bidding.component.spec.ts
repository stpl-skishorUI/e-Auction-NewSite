import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveAuctionBiddingComponent } from './live-auction-bidding.component';

describe('LiveAuctionBiddingComponent', () => {
  let component: LiveAuctionBiddingComponent;
  let fixture: ComponentFixture<LiveAuctionBiddingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiveAuctionBiddingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveAuctionBiddingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
