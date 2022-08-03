import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'vex-auction-plot-profile',
  templateUrl: './auction-plot-profile.component.html',
  styleUrls: ['./auction-plot-profile.component.scss']
})
export class AuctionPlotProfileComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AuctionPlotProfileComponent>
  ) { }

  ngOnInit(): void {
  } 

}
