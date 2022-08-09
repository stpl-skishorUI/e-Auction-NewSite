import { animate, state, style, transition, trigger } from '@angular/animations';
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
// import { MasterService } from 'src/app/core/services/master.service';
import { StaticDropdownService } from 'src/app/core/services/static-dropdown.service';
import { BidderList } from 'src/app/partial/admin/master/bidder-list/bidder-list.model';
import { DocumentsByCriteria} from '../documents-verification.model';

@Component({
  selector: 'vex-document-approve',
  templateUrl: './document-approve.component.html',
  styleUrls: ['./document-approve.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
    fadeInUp400ms,
    stagger40ms
  ],
})
export class DocumentApproveComponent implements OnInit {

  eventDocArray: any;
  @ViewChild(MatSort) sort!: MatSort;
  eventDetailArray: any;
  bidderArray: MatTableDataSource<BidderList> | null | [];
  expandedElement!: any | null;
  eventDetails: MatTableDataSource<DocumentsByCriteria> | null |[];
  isDocumentViewFlag!:string;
  tableDataArray=[];

  EventId: number | string;
  dataSource: any;
  pageNumber: number = 1;

  constructor(
    public location:Location,
    private error: ErrorsService,
    private apiService: ApiService,
    // private spinner: NgxSpinnerService,
    public commonService: CommonService,
    public staticDropdownService: StaticDropdownService,
    public localstorageService: LocalstorageService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private masterService:MasterService,
    private dialogService:DialogService
  ) {
    this.EventId = this.route.snapshot.params['id'];
   }

   columnsBidder: TableColumn<BidderList>[] = [
    { label: 'Sr.No', property: 'srNo', type: 'text', visible: true,},
    { label: 'Bidder Name', property: 'name', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Bidder Mobile', property: 'mobile', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Status', property: 'approvedStatus', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Actions', property: 'actions', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
  ];

  columnsDocument: TableColumn<DocumentsByCriteria>[] = [
    { label: 'Sr.No', property: 'srNo', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Document Name', property: 'documentName', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'View Document', property: 'documentPath', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Verify By', property: 'documentApprovedBy', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Not-Verify Reason', property: 'approvedRemark', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Verify Date', property: 'documentApprovedDatetime', type: 'date', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    {label: ' Status', property: 'documentApprovedStatus', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium',] },
    { label: 'Actions', property: 'actions', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
  ];

  

  get visibleColumns() {
    return this.columnsBidder.filter(column => column.visible).map(column => column.property);
  }

  get VisibleColumnDocument() {
    return this.columnsDocument.filter(column => column.visible).map(column => column.property);
  }

  

  ngOnInit(): void {
    this.getEventDetail_Id();
  }

  getEventDetail_Id() {
    this.apiService.setHttp('get', "event-creation/" + this.EventId, false, false, false, 'bidderUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode === "200") {
          this.eventDetailArray = res.responseData;          
          this.getBidderData()
        } else {
          this.eventDetailArray = [];
          this.commonService.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonService.snackBar(res.statusMessage, 1);
        }
      },
      error: ((error: any) => { this.error.handelError(error.status) })
    });
  }


  getBidderData() {
    this.apiService.setHttp('get', "event-creation/getBidderListByEventId?EventId=" + this.EventId, false, false, false, 'bidderUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode === "200") {
         
         this.tableDataArray = res.responseData;
         this.tableDataArray.map((ele:BidderList,ind:number)=>{
          ele.srNo =((this.pageNumber + 1) * 10 + ind + 1)-20
            })
           this.bidderArray = new MatTableDataSource(this.tableDataArray);
           
           this.bidderArray.sort = this.sort;
        } else {
          this.bidderArray = [];
          this.commonService.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonService.snackBar(res.statusMessage, 1);
        }
      },
      error: ((error: any) => { this.error.handelError(error.status) })
    });
  }

  bidderId!: number | string;
  expandEventrDetails(id: any) {
    this.bidderId = id
    this.apiService.setHttp('get', "event-document/GetByCriteria?EventId=" + this.EventId + '&BidderId=' + this.bidderId, false, false, false, 'bidderUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode === "200") {
          this.eventDetails = res.responseData;
          this.eventDetails = new MatTableDataSource(res.responseData);
          this.eventDetails.sort = this.sort;
        } else {
          this.dataSource = [];
          this.commonService.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonService.snackBar(res.statusMessage, 1);
        }
      },
      error: ((error: any) => { this.error.handelError(error.status) })
    });
  }
  
  takeConfirmation(flag: string,ele:any) {
    if(this.isDocumentViewFlag != ele.documentId){
      this.commonService.snackBar("Please check Document ..",1);
      return;
    }
    let Title: string, dialogText: string;
    Title = flag;
    dialogText = 'Do you want to ' + flag + " ?";
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: this.apiService.modalSize[0],
      data: { p1: dialogText, p2: '', cardTitle: Title, successBtnText: 'Yes', dialogIcon: 'done_outline', cancelBtnText: 'No', inputType: true },
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res.flag == "Yes") {
        let remark = res.inputValue;
        this.updateStatus(remark, flag,ele);
      }
    });
  }


  updateStatus(remark: string, flag: string,tempObj:any) {
    let obj = {
      id: tempObj.id,
      isDocumentApproved: true,
      documentApprovedBy: this.localstorageService.userId(),
      documentApprovedDatetime: new Date(),
      approvedRemark: remark,
      documentApprovedStatus: flag
    }
    this.apiService.setHttp('PUT', "event-participate/UpdateApproveDocument", false, JSON.stringify(obj), false, 'bidderUrl');
    this.apiService.getHttp().subscribe((res: any) => {
      if (res.statusCode == "200") {
        this.expandEventrDetails(this.bidderId);
        // this.commonService.routerLinkRedirect("/document-verification");     
      } else {
        this.commonService.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonService.snackBar(res.statusMessage, 1);
      }
    }, (error: any) => {
      this.error.handelError(error.status);
    });
  }



  viewDocument(url: string,obj:any) {
    this.isDocumentViewFlag=obj.documentId
     this.commonService.redirectToNewTab(url)
   }

  openRequiredDocument(id: any) {
    this.masterService.getEventRequiredDocumentList(id).subscribe({
      next: (response: any) => {
        if (response.length == 0 || response.length == null || response.length == undefined) {
          this.commonService.snackBar('Documenent is not uploaded', 1);
        } else {
          // this.dialog.open(, {
          //   width: this.apiService.modalSize[1],
          //   data: response    //disableClose: true for change pwd dialog close only to click btn
          // });
          this.eventdetails(response);

        }
      },
      error: ((err:any) => { this.error.handelError(err) })
    })
  }


  eventdetails(data){
    let docArray=[];
    data.find((element:object, i:number)=>{
      docArray.push({ 'key': i+1, 'val': element['documentName'], row: 1, tag: '<p> </p>', class: "", col: 1 })
    })
    this.dialogService.detailsComponentDialog(docArray, 'Docuemnt Required', this.apiService.modalSize[0]); // call details dialog modal
  }

  toggleColumnVisibility(column, event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }
 



}
