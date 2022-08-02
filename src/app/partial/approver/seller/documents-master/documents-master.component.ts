import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, UntypedFormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';

import { TableColumn } from 'src/@vex/interfaces/table-column.interface';
import { ConfirmationDialogComponent } from 'src/app/core/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonService } from 'src/app/core/services/common.service';
import { ConfigService } from 'src/app/core/services/config.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { LocalstorageService } from 'src/app/core/services/localstorage.service';
import { DocumentsMaster } from './documents-master.model';

@Component({
  selector: 'vex-documents-master',
  templateUrl: './documents-master.component.html',
  styleUrls: ['./documents-master.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
})
export class DocumentsMasterComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  layoutCtrl = new UntypedFormControl('boxed');
  dataSource: MatTableDataSource<DocumentsMaster> | null;

  documentName = new FormControl();
  editFlag: boolean = false;
  updateDetails: object;

  constructor(
    private apiService: ApiService,
    public dialog: MatDialog,
    public commonService: CommonService,
    private errorsService: ErrorsService,
    public configService: ConfigService,
    private localstorageService: LocalstorageService,
  ) { }

  columns: TableColumn<DocumentsMaster>[] = [
    { label: 'Sr.No', property: 'srNo', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Doc ID', property: 'id', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Document Name', property: 'documentType', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Actions', property: 'actions', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
  ];

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }


  ngOnInit(): void {
    this.documentName = new FormControl('', [Validators.required, Validators.maxLength(100), Validators.pattern('^[^\\s0-9\\[\\[`&._@#%*!+,|"\-\'\/\\]\\]{}][a-zA-Z\\s]+$')]);
    this.getData();
  }


  toggleColumnVisibility(column, event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  // ................. Add Document ..........................// 
  saveDocument() {
    if (this.documentName.invalid) {
      return;
    }
    let reqType = 'post';
    let obj = {
      createdBy: this.editFlag == false ? this.localstorageService.userId() : this.updateDetails['createdBy'],
      modifiedBy: this.editFlag ? this.localstorageService.userId() : 0,
      createdDate: new Date(),
      modifiedDate: new Date(),
      isDeleted: false,
      id: this.editFlag ? this.updateDetails['id'] : 0,
      documentType: this.documentName.value,
      m_DocumentType: this.documentName.value
    }
    this.editFlag ? reqType = 'put' : reqType = 'post';
    this.apiService.setHttp(reqType, "event-document", false, JSON.stringify(obj), false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: object) => {
        if (res['statusCode'] === "200") {
          this.commonService.snackBar(res['statusMessage'], 0);
          this.clear();
          this.getData();
          this.editFlag = false;
        } else {
          this.commonService.checkDataType(res['statusMessage']) == false ? this.errorsService.handelError(res['statusCode']) : this.commonService.snackBar(res['statusMessage'], 1);
        }
      },
      error: ((error: object) => { this.errorsService.handelError(error['status']) })
    });
  }
  // .............................  add Document End Here ...........................//

  //..............................  Get table Data ....................................../
  getData() {
    this.apiService.setHttp('get', "event-document/getAll", false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: object) => {
        if (res['statusCode'] === "200") {
          this.dataSource = new MatTableDataSource(res['responseData']);
          this.dataSource.sort = this.sort;
        } else {
          this.commonService.checkDataType(res['statusMessage']) == false ? this.errorsService.handelError(res['statusCode']) : this.commonService.snackBar(res['statusMessage'], 1);
        }
      },
      error: ((error: object) => { this.errorsService.handelError(error['status']) })
    });
  }
  //..............................  End  table Data Here ....................................../

  // ........................  Delete Data start Here .........................................//

  getConfirmation(id: number) {
    const dialog = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: { p1: 'Are you sure you want to delete this record?', p2: '', cardTitle: 'Delete', successBtnText: 'Delete', dialogIcon: '', cancelBtnText: 'Cancel' },

    })

    dialog.afterClosed().subscribe((res: string) => {
      if (res == 'Yes') {
        this.deleteRecord(id)
      }
    })
  }

  deleteRecord(id: number) {
    let obj = {
      id: id,
      deletedBy: 0
    }
    this.apiService.setHttp('DELETE', "event-document", false, JSON.stringify(obj), false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: object) => {
        if (res['statusCode'] === "200") {
          this.commonService.snackBar(res['statusMessage'], 0);
          this.getData();
        } else {
          if (res['statusCode'] != "404") {
            this.commonService.checkDataType(res['statusMessage']) == false ? this.errorsService.handelError(res['statusCode']) : this.commonService.snackBar(res['statusMessage'], 1);
          }
        }
      },
      error: (err: any) => { this.errorsService.handelError(err) }
    })
  }

  // ........................  Delete Data End Here .........................................//

  //........................  clear Form ..........................//
  clear() {
    this.documentName.reset();
  }
  //.......................... Clear Form End ..............................//
  //.........................  update patchValue  ..........................//
  updateData(ele: DocumentsMaster) {
    this.editFlag = true;
    this.updateDetails = ele;
    this.documentName.setValue(ele.documentType);
  }
  //.........................update patchValue End...................///

}
