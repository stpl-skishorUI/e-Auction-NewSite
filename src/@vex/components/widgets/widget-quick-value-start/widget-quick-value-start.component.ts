import { Component, Input, OnInit } from '@angular/core';
import { scaleInOutAnimation } from '../../../animations/scale-in-out.animation';
//import { MatBottomSheet } from '@angular/material/bottom-sheet';

@Component({
  selector: 'vex-widget-quick-value-start',
  templateUrl: './widget-quick-value-start.component.html',
  animations: [scaleInOutAnimation]
})
export class WidgetQuickValueStartComponent implements OnInit {

  @Input() icon: string;
  @Input() value: string;
  @Input() label: string;
  @Input() change: number;
  @Input() changeSuffix: string;
  @Input() helpText: string;

  showButton: boolean;

  constructor() { }

  ngOnInit() {
  }

  openSheet() {
    //this._bottomSheet.open(ShareBottomSheetComponent);
  }
}
