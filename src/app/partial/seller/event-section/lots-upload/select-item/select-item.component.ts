import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { TableColumn } from 'src/@vex/interfaces/table-column.interface';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonService } from 'src/app/core/services/common.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { LocalstorageService } from 'src/app/core/services/localstorage.service';
import { SharedataService } from 'src/app/core/services/sharedata.service';
import { StaticDropdownService } from 'src/app/core/services/static-dropdown.service';
import { selectItem } from '../lots-upload.model';


@Component({
  selector: 'app-select-item',
  templateUrl: './select-item.component.html',
  styleUrls: ['./select-item.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
})
export class SelectItemComponent implements OnInit {
  //lots table sort 
  columns: TableColumn<selectItem>[] = [
    { label: 'Sr.No', property: 'srNo', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'itemId', property: 'itemId', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Item Name', property: 'itemName', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Item Type', property: 'itemTypeId', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Taluka', property: 'taluka', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Village', property: 'village', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'mineral', property: 'mineral', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'quantity', property: 'quantity', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Actions', property: 'actions', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
  ];

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  trackByProperty<T>(_index: number, column: TableColumn<T>) {
    return column.property;
  }

  toggleColumnVisibility(column, event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  filterForm!: FormGroup;
  pageNumber: number = 1;
  dataSource: MatTableDataSource<selectItem> | any;
  totalRows: any;
  localstorageData = this.localstorageService.getLoggedInLocalstorageData().responseData;
  mineralArray: any;
  ploatArray: any;
  recDataFromLotsUploadComp: any;
  obsSubscription!: Subscription;
  checkBoxChecked: boolean = false;
  seletedLotsArray: any;


  constructor(
    private fb: FormBuilder,
    private error: ErrorsService,
    private apiService: ApiService,
    private commonService: CommonService,
    public dialog: MatDialog,
    public staticDropdownService: StaticDropdownService,
    private localstorageService: LocalstorageService,
    public dialogRef: MatDialogRef<SelectItemComponent>, @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private sharedataService: SharedataService
  ) { }

  ngOnInit() {
    this.defultFilterform();
    this.getMineralType();
    this.getPlotType();
    // console.log(this.dialogData);
    if (this.dialogData) {
      this.recDataFromLotsUploadComp = this.dialogData;
      this.checkBoxChecked = true;
    }
    this.getAllItemList();

  }

  defultFilterform() {
    this.filterForm = this.fb.group({
      plotName: [this.commonService.checkDataType(this.dialogData?.filter?.plotName) == false ? '' : this.dialogData?.filter?.plotName],
      plotType: [this.commonService.checkDataType(this.dialogData?.filter?.plotType) == false ? 0 : this.dialogData?.filter?.plotType],
      mineral: [this.commonService.checkDataType(this.dialogData?.filter?.mineral) == false ? 0 : this.dialogData?.filter?.mineral],
    });
  }

  filterData() {
    this.recDataFromLotsUploadComp = "";
    this.checkBoxChecked = false;
    this.pageNumber = 1;
    this.getAllItemList();
  }


  getAllItemList() {
    let formValue = this.filterForm.value;
    let obj = "ItemName=" + formValue.plotName + "&ItemTypeId=" + formValue.plotType + "&MineralId=" + formValue.mineral;
    this.apiService.setHttp('get', "item/getByCriteria?" + obj, false, false, false, 'bidderUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode === "200") {
          let data = res.responseData;

          this.obsSubscription = this.sharedataService.seletItemArray.subscribe((result: any) => {
            this.seletedLotsArray = result
            this.obsSubscription ? this.obsSubscription.unsubscribe() : '';
          })

          if (this.seletedLotsArray) {
            this.seletedLotsArray.find((ele: any) => {
              data.map((item: any) => {
                if (ele == item.itemId) item['disabled'] = true;
              })
            })
          }

          this.dataSource = new MatTableDataSource(this.resetCheckedFlagInArray(data));
          this.dataSource.sort = this.sort;
          this.totalRows = res.responseData.responseData1?.pageCount;
          this.pageNumber == 1 ? this.paginator?.firstPage() : '';
          this.dialogData && this.checkBoxChecked == true ? this.checkBoxCheck(true, this.dialogData.itemId, this.recDataFromLotsUploadComp) : '';
        } else {
          this.dataSource = []
          this.totalRows = 0;
          if (res.statusCode != "404") {
            this.commonService.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonService.snackBar(res.statusMessage, 1);
          }
        }
      },
      error: ((error: any) => { this.error.handelError(error.status) })
    });
  }

  pageChanged(event: any) {
    this.pageNumber = event.pageIndex + 1;
    this.getAllItemList();
  }

  getMineralType() {
    this.apiService.setHttp('get', "material-master/getAll", false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode === "200") {
          this.mineralArray = res.responseData;
          this.mineralArray = [{ 'material': 'All', 'materialId': 0 }, ...res.responseData];
        } else {
          this.mineralArray = [];
          this.commonService.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonService.snackBar(res.statusMessage, 1);
        }
      },
      error: ((error: any) => { this.error.handelError(error.status) })
    });
  }

  getPlotType() {
    this.apiService.setHttp('get', "material-master/getAllItemType", false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode === "200") {
          this.ploatArray = res.responseData;
          this.ploatArray = [{ 'itemType': 'All', 'itemTypeId': 0 }, ...res.responseData];
        } else {
          this.ploatArray = [];
          this.commonService.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonService.snackBar(res.statusMessage, 1);
        }
      },
      error: ((error: any) => { this.error.handelError(error.status) })
    });
  }

  applyItem(flag: any) {
    debugger;
    if (flag) {
      if (this.commonService.checkDataType(this.recDataFromLotsUploadComp) == false) {
        this.commonService.snackBar("At least 1 recored is required", 1);
        return
      }
      let data = this.recDataFromLotsUploadComp ? this.recDataFromLotsUploadComp : false;
      data.modalFlag = true;
      data != false ? data['filter'] = this.filterForm.value : '';
      this.dialogRef.close(data);
    } else {
      let data: any = this.commonService.checkDataType(this.dialogData) == false ? false : this.dialogData;
      this.dialogRef.close(data);
    }
    // let data = this.recDataFromLotsUploadComp ? this.recDataFromLotsUploadComp : '';
    // if (flag == false) {
    //   if (this.commonService.checkDataType(this.recDataFromLotsUploadComp) == false) {
    //     this.commonService.snackBar("At least 1 recored is required", 1);
    //     return
    //   }
    //   data ? data['filter'] = this.filterForm.value : '';
    //   data.modalFlag = true;
    //   this.dialogRef.close(data);
    // } else {
    //   data.modalFlag = false;
    //   console.log(this.dialogData);
    //   this.dialogRef.close(data);
    // }
  }


  checkBoxCheck(event: any, itemId: any, getObj?: any) {
    let data: any = this.dataSource?.filteredData;
    if (event == true) {
      data.map((ele: any) => {
        if (ele.itemId == itemId) {
          ele.checked = true;
          this.checkBoxChecked = true;
          this.recDataFromLotsUploadComp = getObj;
        } else { ele.checked = false; }
      });
    } else {
      this.recDataFromLotsUploadComp = '';
      this.checkBoxChecked = false;
      this.resetCheckedFlagInArray(this.dataSource.filteredData);
    }
  }

  resetCheckedFlagInArray(data: any) {
    return data.map((ele: any) => ({ ...ele, checked: false }));
  }

}
