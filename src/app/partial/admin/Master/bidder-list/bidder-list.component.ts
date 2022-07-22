
import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnInit, ViewChild, } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ReplaySubject } from 'rxjs';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { TableColumn } from 'src/@vex/interfaces/table-column.interface';
import { ConfirmationDialogComponent } from 'src/app/core/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonService } from 'src/app/core/services/common.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { UserRegistration } from '../user-registration/user-registration.model';

@Component({
  selector: 'vex-bidder-list',
  templateUrl: './bidder-list.component.html',
  styleUrls: ['./bidder-list.component.scss'],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'standard'
      } as MatFormFieldDefaultOptions
    }
  ],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
})
export class BidderListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  layoutCtrl = new UntypedFormControl('boxed');
  selection = new SelectionModel<UserRegistration>(true, []);
  searchCtrl = new UntypedFormControl();
  dataSource: MatTableDataSource<UserRegistration> | null;
  userRegistration: UserRegistration[];
  subject$: ReplaySubject<UserRegistration[]> = new ReplaySubject<UserRegistration[]>(1);

  @Input()
  pageNumber: number = 1;
  columns: TableColumn<UserRegistration>[] = [
    { label: 'Sr.No', property: 'srNo', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Name', property: 'name', type: 'text', visible: true },
    { label: 'District', property: 'district', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Mobile', property: 'mobile', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Bidder Type', property: 'bidderType', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },

    { label: 'Dsc Status', property: 'isDsc', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Unblock Block', property: 'isBlock', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Actions', property: 'actions', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
  ];

  filterForm!: FormGroup;
  totalRows: number;

  constructor(public dialog: MatDialog,
    private apiService: ApiService, private fb: FormBuilder,
    public commonService: CommonService,
    private localstorageService: LocalstorageService,
    private error: ErrorsService, private masterService: MasterService) { }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  pageSizeOptions: number[] = [5, 10, 20, 50];
  pageSize = 10;

  ngOnInit(): void {
    this.defultFilterform()
    this.getData();
  }

  defultFilterform() {
    this.filterForm = this.fb.group({
      stateId: [],
      divisionId: [0],
      districtId: [0],
      talukaId: [0],
      search: [''],
    });
  }
  createUser(): void {
    //@ts-ignore
    const dialogRef = this.dialog.open(AddUserComponent, {
      width: '250px',
      disableClose: false,
      data: '',
    });
  }

  deleteCustomers(_customers: UserRegistration[]) {
    // this.userRegistration.splice(this.userRegistration.findIndex((existingCustomer) => existingCustomer.id === customer.id), 1);
    // this.selection.deselect(customers);
    this.subject$.next(this.userRegistration);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  trackByProperty<T>(_index: number, column: TableColumn<T>) {
    return column.property;
  }

  onLabelChange(change: MatSelectChange, row: UserRegistration) {
    const index = this.userRegistration.findIndex(c => c === row);
    this.userRegistration[index].labels = change.value;
    this.subject$.next(this.userRegistration);
  }

  toggleColumnVisibility(column, event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  // pagination code start here //
  pageChanged(event: any) {
    this.pageNumber = event.pageIndex + 1;
    this.getData();
  }


  createBidder() {
    const dialogRef = this.dialog.open(AddBidderComponent, {
      width: '400px',
      disableClose: true,
      data: '',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  userBlockUnBlockModal(element: any, event: any) {
    let Title: string, dialogText: string;
    event.checked == true ? Title = 'User Block' : Title = 'User Unblock';
    event.checked == true ? dialogText = 'Do you want to User Block' : dialogText = 'Do you want to User Unblock';
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '340px',
      data: { p1: dialogText, p2: '', cardTitle: Title, successBtnText: 'Yes', dialogIcon: 'done_outline', cancelBtnText: 'No' },
      disableClose: this.apiService.disableCloseFlag,
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      res == 'Yes' ? this.userBlockUnBlock(element, event.checked) : !event.checked ? event.source.checked = true : event.source.checked = false;
    });
  }

  userBlockUnBlock(element: any, event: any) {
    let obj = {
      "id": element?.userId,
      "isBlock": event == true ? true : false,
      "blockDate": new Date(),
      "blockBy": this.localstorageService.userId(),
      "blockRemark": ""
    }
    this.apiService.setHttp('PUT', "user-registration/BlockUnblockUser", false, JSON.stringify(obj), false, 'masterUrl');
    this.subscription = this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode === "200") {
          this.getData();
          this.commonService.snackBar(res.statusMessage, 0);
        } else {
          if (res.statusCode != "404") {
            this.commonService.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonService.snackBar(res.statusMessage, 1);
          }
        }
      },
      error: (err: any) => { this.error.handelError(err) }
    })
  }
}
