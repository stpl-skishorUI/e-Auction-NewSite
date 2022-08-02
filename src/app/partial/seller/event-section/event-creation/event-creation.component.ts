import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
@Component({
  selector: 'vex-event-creation',
  templateUrl: './event-creation.component.html',
  styleUrls: ['./event-creation.component.scss']
})
export class EventCreationComponent implements OnInit {
  layoutCtrl = new UntypedFormControl('boxed');
  constructor() { }

  ngOnInit(): void {
  }

}
