import { Component, OnInit } from '@angular/core';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';


@Component({
  selector: 'vex-components-dialogs',
  templateUrl: './components-dialogs.component.html',
  styleUrls: ['./components-dialogs.component.scss'],
  animations: [
    stagger80ms,
    scaleIn400ms,
    fadeInRight400ms,
    fadeInUp400ms
  ]
})
export class ComponentsDialogsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
