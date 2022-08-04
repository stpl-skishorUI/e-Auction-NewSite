import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';

import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { TableColumn } from 'src/@vex/interfaces/table-column.interface';
import { ConfirmationDialogComponent } from 'src/app/core/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonService } from 'src/app/core/services/common.service';
import { DialogService } from 'src/app/core/services/dialog.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { LocalstorageService } from 'src/app/core/services/localstorage.service';
import { MasterService } from 'src/app/core/services/master.service';
import { StaticDropdownService } from 'src/app/core/services/static-dropdown.service';
import { ApproveEvent } from './approve-event.model';

@Component({
  selector: 'vex-approve-event',
  templateUrl: './approve-event.component.html',
  styleUrls: ['./approve-event.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
})
export class ApproveEventComponent implements OnInit {

  dataSource: MatTableDataSource<ApproveEvent> | null;
  localstorageData = this.localstorageService.getLoggedInLocalstorageData().responseData;
  eventDocumentArray=[];
  eventDetailObj:any;
  EventId:number;
  eventItemDetailArray=[];
  eventDocArray=[];
  pageNumber: number = 1;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public location: Location,
    private error: ErrorsService,
    private apiService: ApiService,
    public commonService: CommonService,
    public staticDropdownService:StaticDropdownService,
    public localstorageService:LocalstorageService,
    private route: ActivatedRoute,
    private masterService: MasterService,
    public dialog: MatDialog,
    private dialogService:DialogService
  ) {
    this.EventId = this.route.snapshot.params['id'];
   }

   columns: TableColumn<ApproveEvent>[] = [
    { label: 'Sr.No', property: 'srNo', type: 'button', visible: true },
    { label: 'LOT ID', property: 'lotId', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Item Name', property: 'itemName', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Item Description', property: 'remark', type: 'text', visible: false , cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'UOM',  property: 'unit', type: 'text', visible: false , cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Quantity', property:'quantity', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Opening Price', property: 'openingBid', type: 'text', visible: false , cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Bid Increment', property: 'minBidIncrement', type: 'text', visible: true , cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'EMD', property: 'emD_SecurityDeposit', type: 'text', visible: true , cssClasses: ['text-secondary', 'font-medium'] },
  ];

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  ngOnInit(): void {
    this.getEventDetail_Id();
    this.getEventDocument();
    this.getEventItemDetail();
  }

  getEventDetail_Id() {
    this.apiService.setHttp('get', "event-creation/" + this.EventId, false, false, false, 'bidderUrl');
    this.apiService.getHttp().subscribe({
      next: (res: object) => {
        if (res['statusCode'] === "200") {
          this.eventDetailObj = res['responseData'];
          console.log( this.eventDetailObj);
          this.getEventItemDetail();
        } else {
          this.eventDetailObj = [];
          this.commonService.checkDataType(res['statusMessage']) == false ? this.error.handelError(res['statusCode']) : this.commonService.snackBar(res['statusMessage'], 1);
        }
      },
      error: ((error: object) => { this.error.handelError(error['status']) })
    });
  }
  

  getEventDocument() {
    this.apiService.setHttp('get', "event-document/getDocByEventId?EventId=" + this.EventId, false, false, false, 'bidderUrl');
    this.apiService.getHttp().subscribe({
      next: (res: object) => {
        if (res['statusCode'] === "200") {
          this.eventDocArray = res['responseData'];
          // this.dataSource = new MatTableDataSource(res.responseData);
          // this.dataSource.sort = this.sort;
        } else {
          // this.dataSource = null;
          this.commonService.checkDataType(res['statusMessage']) == false ? this.error.handelError(res['statusCode']) : this.commonService.snackBar(res['statusMessage'], 1);
        }
      },
      error: ((error: object) => { this.error.handelError(error['status']) })
    });
  }

  getEventItemDetail() {
    this.apiService.setHttp('get', "lot-creation/getByEventId/" + this.EventId, false, false, false, 'bidderUrl');
    this.apiService.getHttp().subscribe({
      next: (res: object) => {
        if (res['statusCode'] === "200") {
          this.eventItemDetailArray = res['responseData'];
           this.dataSource = new MatTableDataSource(res['responseData']);
           this.dataSource.sort = this.sort;
        } else {
           this.dataSource = null;
          this.commonService.checkDataType(res['statusMessage']) == false ? this.error.handelError(res['statusCode']) : this.commonService.snackBar(res['statusMessage'], 1);
        }
      },
      error: ((error: object) => { this.error.handelError(error['status']) })
    });
  }

  openRequiredDocument(id: number) {
    this.masterService.getEventRequiredDocumentList(id).subscribe({
      next: (response: object) => {
        if (response['length'] == 0 || response['length'] == null || response['length'] == undefined) {
          this.commonService.snackBar('Documenent is not uploaded', 1);
        } else {
           this.eventDetails(response);
        }
      },
      error: (err => { this.error.handelError(err) })
    })
  }

  // ............................show Document ...............................
  eventDetails(data){
    let docArray=[];
    data.find((element:object, i:number)=>{
      docArray.push({ 'key': i+1, 'val': element['documentName'], row: 1, tag: '<p> </p>', class: "", col: 1 })
    })
    this.dialogService.detailsComponentDialog(docArray, 'Docuemnt Required', this.apiService.modalSize[0]); // call details dialog modal
  }

  //................................table column show or hide

  toggleColumnVisibility(column, event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

// ................conformation for send to approval...................

  sendApprovalModal(flag: string) {
    if (this.eventItemDetailArray.length <= 0) {
      this.commonService.snackBar('Please First Lots Create', 1);
    } else {
      let inputFlag: boolean;
      this.localstorageService.getRoleTypeId() == 4 ? inputFlag = true : inputFlag = false;
      let titleDisplay:any;
      flag === "Rejected" ?titleDisplay = "Reject " : titleDisplay="Approve "
      let Title: string, dialogText: string;
      Title = inputFlag ? titleDisplay : 'Send Approval';
      dialogText = inputFlag ? 'Do you want to ' + titleDisplay +"?": 'Do you want to Send For Approval?';
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: this.apiService.modalSize[0],
        data: { p1: dialogText, p2: '', cardTitle: Title, successBtnText: 'Yes', dialogIcon: 'done_outline', cancelBtnText: 'No', inputType: inputFlag },
      });
      dialogRef.afterClosed().subscribe((res: any) => {
        if (inputFlag == true && res.flag == "Yes") {
          let remark = res.inputValue;
          this.isRejectOrApprover(remark, flag);
        } else {
          res == 'Yes' ? this.sendForApproval() : '';
        }
      });
    }
  }
  // .................. Seller send to Approval ...........................//
  sendForApproval() {
    let obj = { "id": this.EventId, "isSendforApproval": true }
    this.apiService.setHttp('PUT', "event-creation/sendforApproval", false, JSON.stringify(obj), false, 'bidderUrl');
    this.apiService.getHttp().subscribe((res: object) => {
      if (res['statusCode'] == "200") {
        this.commonService.routerLinkRedirect('/event-list');
      } else {
        this.commonService.checkDataType(res['statusMessage']) == false ? this.error.handelError(res['statusCode']) : this.commonService.snackBar(res['statusMessage'], 1);
      }
    }, (error: object) => {
      this.error.handelError(error['status']);
    });
  }

  //  ................... approver Login ..............//
  isRejectOrApprover(remark: string, flag: string) {
    let obj = {
      id: this.EventId,
      status: flag,
      approvedBy: this.localstorageService.userId(),
      approvedDatetime: new Date(),
      approvedRemark: remark
    }
    this.apiService.setHttp('PUT', "event-creation/eventapproval", false, JSON.stringify(obj), false, 'bidderUrl');
    this.apiService.getHttp().subscribe((res:object) => {
      if (res['statusCode'] == "200") {
        this.commonService.routerLinkRedirect('/approver-event-list');
        // this.commonService.snackBar(res.statusMessage, 0);
      } else {
        this.commonService.checkDataType(res['statusMessage']) == false ? this.error.handelError(res['statusCode']) : this.commonService.snackBar(res['statusMessage'], 1);
      }
    }, (error: object) => {
      this.error.handelError(error['status']);
    });
  }



}
