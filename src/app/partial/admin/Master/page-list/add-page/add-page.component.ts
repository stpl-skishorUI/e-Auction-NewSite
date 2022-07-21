import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ConfigService } from 'src/app/core/services/config.service';

@Component({
  selector: 'vex-add-page',
  templateUrl: './add-page.component.html',
  styleUrls: ['./add-page.component.scss']
})
export class AddPageComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<AddPageComponent>,
    
    public configService:ConfigService) { }

  ngOnInit(): void {
  }

  close(flag:string){
this.dialogRef.close(flag);
  }

}
