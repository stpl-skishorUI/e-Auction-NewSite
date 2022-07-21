import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BidderAgreementReportComponent } from './bidder-agreement-report.component';

describe('BidderAgreementReportComponent', () => {
  let component: BidderAgreementReportComponent;
  let fixture: ComponentFixture<BidderAgreementReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BidderAgreementReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BidderAgreementReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
