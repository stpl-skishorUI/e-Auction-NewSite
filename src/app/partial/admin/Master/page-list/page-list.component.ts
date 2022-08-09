import { SelectionModel } from '@angular/cdk/collections';
import {  Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { ReplaySubject } from 'rxjs';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { TableColumn } from 'src/@vex/interfaces/table-column.interface';
import { ConfirmationDialogComponent } from 'src/app/core/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonService } from 'src/app/core/services/common.service';
import { ConfigService } from 'src/app/core/services/config.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { AddPageComponent } from './add-page/add-page.component';
import { PageList } from './page-list.model';
@Component({
  selector: 'vex-page-list',
  templateUrl: './page-list.component.html',
  styleUrls: ['./page-list.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
})
export class PageListComponent implements OnInit{
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  layoutCtrl = new UntypedFormControl('boxed');
  dataSource: MatTableDataSource<PageList> | null | any;
  selection = new SelectionModel<PageList>(true, []);
  searchCtrl = new UntypedFormControl();
  subject$: ReplaySubject<PageList[]> = new ReplaySubject<PageList[]>(1);
  pageList: PageList[];
  noDataFlag:boolean = false;

  searchFilter= new FormControl('');
  totalRows: number= 0;
  totalPages:number;
 
   pageNumber: number = 1;

   highlightedRow:number;
   

  @Input()
  columns: TableColumn<PageList>[] = [
    { label: 'Sr.No', property: 'srNo', type: 'button', visible: true },
    { label: 'Page ID', property: 'pageId', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Page URL', property: 'pageURL', type: 'text', visible: true },
    { label: 'Page Name', property: 'pageName', type: 'text', visible: true },
    { label: 'Actions', property: 'actions', type: 'button', visible: true },
  ];

  pageSizeOptions: number[] = [5, 10, 20, 50];
  pageSize = 10;
  

  constructor(public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private apiService: ApiService, 
    public commonService: CommonService,
    private error: ErrorsService,
    public configService:ConfigService) { }

  ngOnInit(): void {
   this.bindTable();
   
  }
  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  // ........................Bind Api data to table ................................. */

  bindTable() {
    this.spinner.show();
    let paramList: string = "?pageno=" + this.pageNumber + "&pagesize="+this.pageSize + "&TextSearch=" + this.searchFilter.value;
    this.apiService.setHttp('get', "pagemaster/GetAll" + paramList, false, false, false, 'masterUrl');
   this.apiService.getHttp().subscribe({
      next: (res: object) => {
        if (res['statusCode'] === "200") {  
          this.spinner.hide();       
          this.dataSource = new MatTableDataSource(res['responseData'].responseData1);
          this.totalRows = res['responseData'].responseData2.pageCount;
           this.totalPages = res['responseData'].responseData2.totalPages;
           this.dataSource.sort = this.sort;
           this.noDataFlag = true;
           this.pageNumber == 1 ? this.paginator?.firstPage() : ''; 
        } else {
          this.spinner.hide();     
          this.dataSource = null;
          this.totalRows = 0;
          if (res['statusCode'] != "404") {
            this.spinner.hide();     
            this.commonService.checkDataType(res['statusMessage']) == false ? this.error.handelError(res['statusCode']) : this.commonService.snackBar(res['statusMessage'], 1);
          }
        }
      },
      error: ((error) => { this.error.handelError(error.status) })
    });
  }

  getData() {
    this.pageNumber = 1;
    this.bindTable();
  }
// ...................open Dialog for create page and update page.......................*/

  createPage(obj?:PageList){
    this.highlightedRow = obj ? obj.pageId : 0;
    const dialogRef = this.dialog.open(AddPageComponent, {
      width: '40rem',
      disableClose: true,
      data: obj ? (obj['pageNumber'] = this.pageNumber, obj) : '',
      // data: obj 
    })
    dialogRef.afterClosed().subscribe(result => {
       console.log(`Dialog result: ${result}`);
       this.highlightedRow = 0;
       if(result == 'post'){
        this.pageNumber = this.totalPages;
        this.bindTable();
       }else{
        // this.pageNumber = 1;
        this.bindTable();
       }
    });
  }

// ........................ Paginator method ................................. */

  pageChanged(event:PageEvent) {
    // if(event.pageSize !=10) this.pageSize = event.pageSize;
    this.pageSize = event.pageSize;
    this.commonService.removeFilerLocalStorage('pagination');
    this.pageNumber = event.pageIndex + 1;
    this.bindTable();
  }

  // ........................ show and hide column in table ................................. */

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
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
  onLabelChange(change: MatSelectChange, row: PageList) {
    const index = this.pageList.findIndex(c => c === row);
    this.pageList[index].labels = change.value;
    this.subject$.next(this.pageList);
  }

  // ........................ Confiramation for delete page record................................. */

  deleteRecord(pageId) {
    let title: string = 'Delete';
    let dialogText: string = 'Are you sure you want to delete this record ?';
   
    const dialog = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: { p1: dialogText, p2: '', cardTitle: title, successBtnText: 'Yes', dialogIcon: '', cancelBtnText: 'No' },
      disableClose: this.apiService.disableCloseFlag,
    })
    dialog.afterClosed().subscribe(res => {
      if (res == 'Yes') {
        this.callPageDeleteAPI(pageId);
      }
    })
  }

// ........................ Api call for delete page record................................. */

  callPageDeleteAPI(pageId: number) {
    let obj = {
      "pageId": pageId
    }
    this.apiService.setHttp('DELETE', "pagemaster/DeletePage", false, JSON.stringify(obj), false, 'masterUrl');
     this.apiService.getHttp().subscribe({
      next: (res: object) => {
        if (res['statusCode'] === "200") {
          this.bindTable();
          this.commonService.snackBar(res['statusMessage'], 0);
        } else {
          if (res['statusCode'] != "404") {
            this.commonService.checkDataType(res['statusMessage']) == false ? this.error.handelError(res['statusCode']) : this.commonService.snackBar(res['statusMessage'], 1);
          }
        }
      },
      error: (err) => { this.error.handelError(err) }
    })
  }

}
