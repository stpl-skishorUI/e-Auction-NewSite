import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { TableColumn } from 'src/@vex/interfaces/table-column.interface';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonService } from 'src/app/core/services/common.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { LocalstorageService } from 'src/app/core/services/localstorage.service';
import { EventDetails } from './event-details.model';
@Component({
  selector: 'vex-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit {
  layoutCtrl = new UntypedFormControl('boxed');
  eventId: string;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource: MatTableDataSource<EventDetails> | any;
  selection = new SelectionModel<EventDetailsComponent>(true, []);

  columns: TableColumn<EventDetails>[] = [
    { label: 'Sr.No', property: 'srNo', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Event Level', property: 'eventLevel', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'District', property: 'district', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Event Code', property: 'eventCode', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Title', property: 'title', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Description', property: 'description', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Bid Submission Start Date', property: 'bidSubmissionStartDate', type: 'date', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Bid Submission End Date', property: 'bidSubmissionEndDate', type: 'date', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Action', property: 'action', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
  ];


  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    public commonService: CommonService,
    private errorsService: ErrorsService,
    private localstorageService: LocalstorageService
  ) { }

  ngOnInit(): void {
    this.eventId = this.route.snapshot.params['id'];
    this.getEventDataById();
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }
  //....... getData 
  getEventDataById() {
    let bidderId = this.localstorageService.getBidderId();
    bidderId
    this.apiService.setHttp("get", "event-participate/GetbyBidderId?BidderId=" + bidderId, false, false, false, 'bidderUrl');
    this.apiService.getHttp().subscribe({
      next: (res) => {
        if (res.statusCode === "200") {
          let documentArray = res.responseData;
          this.dataSource = new MatTableDataSource(documentArray);
          this.dataSource.sort = this.sort;
        } else {
          this.dataSource = [];
          if (res.statusCode == '404') {
            this.commonService.checkDataType(res.statusMessage) == false ? this.errorsService.handelError(res.statusCode) : this.commonService.snackBar(res.statusMessage, 1);
          }

        }
      },
      error: ((error) => { this.errorsService.handelError(error.status) })
    });

  }

  // ....................   reDirect To document page ..................................//
  uploadDocumentPage() {

  }

  toggleColumnVisibility(column, event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
}
