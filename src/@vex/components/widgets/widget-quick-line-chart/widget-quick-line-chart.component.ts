import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ApexOptions } from '../../chart/chart.component';
import { defaultChartOptions } from '../../../utils/default-chart-options';

import { scaleInOutAnimation } from '../../../animations/scale-in-out.animation';

@Component({
  selector: 'vex-widget-quick-line-chart',
  templateUrl: './widget-quick-line-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [scaleInOutAnimation]
})
export class WidgetQuickLineChartComponent implements OnInit {

  @Input() icon: string;
  @Input() value: string;
  @Input() label: string;
  @Input() iconClass: string;
  @Input() options: ApexOptions = defaultChartOptions({
    chart: {
      type: 'area',
      height: 100
    }
  });
  @Input() series: ApexNonAxisChartSeries | ApexAxisChartSeries;

  showButton: boolean;

  constructor() { }

  ngOnInit() {
  }

  openSheet() {
   // this._bottomSheet.open(ShareBottomSheetComponent);
  }
}

