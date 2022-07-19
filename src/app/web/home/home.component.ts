import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonService } from 'src/app/core/services/common.service';
import { ConfigService } from 'src/app/core/services/config.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { LocalstorageService } from 'src/app/core/services/localstorage.service';
import { TranslateService } from 'src/app/core/services/translate.service';

@Component({
  selector: 'vex-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'standard'
      } as MatFormFieldDefaultOptions
    }
  ]
})

export class HomeComponent implements OnInit {
  topFilterForm: FormGroup;
  pageNo: number = 1;

  constructor(
    private commonService: CommonService,
    private datePipe: DatePipe,
    private error: ErrorsService,
    private fb: FormBuilder,
    private apiService: ApiService,
    private translate: TranslateService,
    private configService: ConfigService,
    private localstorageService: LocalstorageService) { }

  ngOnInit(): void {
    this.defulatForm();
    this.bindTable();
  }

  defulatForm() {
    this.topFilterForm = this.fb.group({
      levelId: [''],
      districtId: [0],
      mineralId: [0],
      search: [''],
      startDate: [''],
      endDate: [''],
    })
  }

  bindTable() {
    const formValue = this.topFilterForm.value;
    let paramList = '?EventLevel=' + formValue.levelId + '&DistrictId=' + formValue.districtId + '&MineralId=' + formValue.mineralId + '&pageno=' + this.pageNo + '&pagesize=' + this.configService.pageSize //+'&Status=&StartDate=1&EndDate=1'
    if (formValue.startDate && formValue.endDate) {
      const startDate = this.datePipe.transform(formValue.startDate, 'yyyy-MM-dd');
      const enddate = this.datePipe.transform(formValue.endDate, 'yyyy-MM-dd');
      paramList += '&StartDate=' + startDate + '&EndDate=' + enddate
    }
    this.commonService.checkDataType(formValue.search) == true ? paramList += "&TextSearch=" + formValue.search : "";

    paramList += '&TenderType=Active';
    this.apiService.setHttp('get', 'event-creation/getAll' + paramList + "&IsPublished=1", false, false, false, 'bidderUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode === "200") {
          console.log(res);
        } else {
          if (res.statusCode != "404") {
            this.commonService.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonService.snackBar(res.statusMessage, 1);
          }
        }
      },
      error: ((error: any) => { this.error.handelError(error.status) })
    });
  }
}