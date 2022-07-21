import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighestAuctionReportComponent } from './highest-auction-report.component';

describe('HighestAuctionReportComponent', () => {
  let component: HighestAuctionReportComponent;
  let fixture: ComponentFixture<HighestAuctionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HighestAuctionReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HighestAuctionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
