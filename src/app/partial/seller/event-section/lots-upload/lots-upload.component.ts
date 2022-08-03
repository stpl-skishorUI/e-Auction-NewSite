import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationDialogComponent } from 'src/app/core/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonService } from 'src/app/core/services/common.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { LocalstorageService } from 'src/app/core/services/localstorage.service';
import { MasterService } from 'src/app/core/services/master.service';
import { SharedataService } from 'src/app/core/services/sharedata.service';
import { StaticDropdownService } from 'src/app/core/services/static-dropdown.service';
import { SelectItemComponent } from './select-item/select-item.component';
import { Location } from '@angular/common';
import { ConfigService } from 'src/app/core/services/config.service';
import { TableColumn } from 'src/@vex/interfaces/table-column.interface';
import { documentsUpload, LotsUpload } from './lots-upload.model';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';

@Component({
  selector: 'vex-lots-upload',
  templateUrl: './lots-upload.component.html',
  styleUrls: ['./lots-upload.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
})

export class LotsUploadComponent implements OnInit {
  dataSource: MatTableDataSource<LotsUpload> | [];
  dataSourceDocument: MatTableDataSource<documentsUpload> | [];
  lotsItemForm!: FormGroup | any;
  @ViewChild('myForm', { static: false }) myForm!: NgForm;
  recDataFromSelectItemModal: any;
  addLotDataArray: any[] = [];
  pageNumber: number = 1;
  documentListArray: any;
  displayedColumnsDocuments: string[] = ['position', 'documentType', 'selectItem'];
  documentListHide: boolean = false;
  addEventDocumentArray: any[] = [];
  buttonText = 'Add Lot';
  editIndex: any;
  disableDiv: boolean = true;
  lotCreationArray: any[] = [];
  EventId: any;
  eventCode: any;
  @ViewChild(MatSort) sort!: MatSort;
  feesChargesItemArray: any[] = [];
  editFlag: boolean = false;
  editEventId: any;
  lotsItemId: any;
  selDocArrForEdit: any;

  constructor(
    public configService: ConfigService,
    public location: Location,
    private fb: FormBuilder,
    private error: ErrorsService,
    private apiService: ApiService,
    private commonService: CommonService,
    public staticDropdownService: StaticDropdownService,
    private localstorageService: LocalstorageService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private sharedataService: SharedataService,
    private masterService: MasterService) { }

  //lots table sort 
  columns: TableColumn<LotsUpload>[] = [
    { label: 'Sr.No', property: 'srNo', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Plot Number', property: 'plotNumber', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Item Name', property: 'itemName', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Quantity', property: 'quantity', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Unit Of Mesurment', property: 'unitOfMesurment', type: 'text', visible: false, cssClasses: ['text-secondary', 'font-medium'] },

    { label: 'Tender Application Fee', property: 'tender_ApplicationFee', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Min Bid Increment', property: 'minBidIncrement', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'EMD Security Deposit', property: 'emD_SecurityDeposit', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Actions', property: 'actions', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
  ];

  columnsDoc: TableColumn<documentsUpload>[] = [
    { label: 'Sr.No', property: 'srNo', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Id', property: 'id', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Document Type', property: 'documentType', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Actions', property: 'actions', type: 'button', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
  ];
  

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  get visibleColumnsDoc() {
    return this.columnsDoc.filter(column => column.visible).map(column => column.property);
  }


  trackByProperty<T>(_index: number, column: TableColumn<T>) {
    return column.property;
  }

  toggleColumnVisibility(column, event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }
  //lots table sort 


  ngOnInit(): void {
    this.defaultLotsItem();
    let getUrlData: any = this.router.url.split('/')[4];
    if (getUrlData >= 1) {
      this.editFlag = true;
      this.editEventId = this.router.url.split('/')[3];
      this.masterService.getEventItemDetail(this.editEventId).subscribe((res: any) => {
        this.addLotDataArray = res;

        this.lotCreationArray = res.map((ele: any) => {
          ele['createdBy'] = this.localstorageService.userId();
          ele['modifiedBy'] = this.localstorageService.userId();
          ele['createdDate'] = new Date();
          ele['modifiedDate'] = new Date();
          ele['isDeleted'] = true;
          return ele
        });
        this.recDataFromSelectItemModal = this.addLotDataArray[0];
        this.lotsItemId = this.addLotDataArray[0]?.itemId;
        this.dataSource = new MatTableDataSource(this.addLotDataArray);
        this.itemDetailsById(this.lotsItemId);
      })
    }
    // this.defaultLotsItem()
  }


  //----------------------------------------------- edit lots upload code start  here --------------------------------------------------------//

  itemDetailsById(itemId: any) {
    this.apiService.setHttp('get', "item/GetById?Id=" + itemId, false, false, false, 'bidderUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode === "200") {
          this.defaultLotsItem(res.responseData);
          this.openRequiredDocument(this.editEventId)
        } else {
          this.commonService.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonService.snackBar(res.statusMessage, 1);
        }
      },
      error: ((error: any) => { this.error.handelError(error.status) })
    });
  }

  openRequiredDocument(id: any) {
    this.masterService.getEventRequiredDocumentList(id).subscribe({
      next: (response: any) => {
        if (response.length >= 1) {
          this.documentListHide = true;
          this.getdocumentList();
          this.selDocArrForEdit = response;
          this.addEventDocumentArray = response;
        } else {
          this.documentListHide = false;
        }
      },
      error: ((err: any) => { this.error.handelError(err) })
    })
  }

  checkedDocListArraya(data: any) {
    this.documentListArray = data.map((ele: any) => {
      this.selDocArrForEdit.find((res: any) => {
        if (ele.id == res.eventDocumentId) {
          ele.documentId = res?.eventDocumentId;
          ele['checked'] = true;
        }
      })
      return ele;
    });
    console.log(this.documentListArray);
    this.dataSourceDocument = new MatTableDataSource(this.documentListArray);
  }

  //----------------------------------------------- edit lots upload code end  here --------------------------------------------------------//

  get f() { return this.lotsItemForm.controls }

  defaultLotsItem(obj?: any) {
    this.lotsItemForm = this.fb.group({
      eventId: [this.eventCode],
      itemName: [obj?.itemName || ''],
      plotNumber: [obj?.plotNumber || ''],
      mineral: [obj?.mineral || ''],
      area: [obj?.area || ''],
      taluka: [obj?.taluka || ''],
      latitude: [obj?.latitude || ''],
      longitude: [obj?.longitude || ''],
      quantity: [obj?.quantity || ''],
      district: [obj?.district || ''],
      village: [obj?.village || ''],
      itemId: [obj?.itemId || ''], // use for uniq id
      unitOfMesurment: [obj?.unitOfMesurment || ''],
      tender_ApplicationFee: [obj?.tender_ApplicationFee || '', [Validators.required, Validators.minLength(2), Validators.maxLength(6), Validators.pattern('^[^\\s\\[\\[`&a-zA-z._@#%*!+,|"\-\'\/\\]\\]{}][0-9\\s]+$')]],
      // openingBid: ['',[Validators.required,Validators.maxLength(9),Validators.pattern('^[^\\s\\[\\[`&a-zA-z._@#%*!+,|"\-\'\/\\]\\]{}][0-9\\s]+$')]],
      openingBid: [0],
      emD_SecurityDeposit: ['', [Validators.required, Validators.maxLength(9), Validators.pattern('^[^\\s\\[\\[`&a-zA-z._@#%*!+,|"\-\'\/\\]\\]{}][0-9\\s]+$')]],
      offsetValue: ['', [Validators.maxLength(9), Validators.pattern('^[^\\s\\[\\[`&a-zA-z._@#%*!+,|"\-\'\/\\]\\]{}][0-9\\s]+$')]],
      minBidIncrement: ['', [Validators.required, Validators.maxLength(7), Validators.pattern('^[^\\s\\[\\[`&a-zA-z._@#%*!+,|"\-\'\/\\]\\]{}][0-9\\s]+$')]],
      gst: ['', [Validators.maxLength(7), Validators.pattern('^[^\\s\\[\\[`&a-zA-z._@#%*!+,|"\-\'\/\\]\\]{}][0-9\\s]+$')]],
      cgst: ['', [Validators.maxLength(7), Validators.pattern('^[^\\s\\[\\[`&a-zA-z._@#%*!+,|"\-\'\/\\]\\]{}][0-9\\s]+$')]],
      sgst: ['', [Validators.maxLength(7), Validators.pattern('^[^\\s\\[\\[`&a-zA-z._@#%*!+,|"\-\'\/\\]\\]{}][0-9\\s]+$')]],
      igst: ['', [Validators.maxLength(7), Validators.pattern('^[^\\s\\[\\[`&a-zA-z._@#%*!+,|"\-\'\/\\]\\]{}][0-9\\s]+$')]],
      tcs: ['', [Validators.maxLength(7), Validators.pattern('^[^\\s\\[\\[`&a-zA-z._@#%*!+,|"\-\'\/\\]\\]{}][0-9\\s]+$')]],
      anyOther: ['', [Validators.maxLength(7), Validators.pattern('^[^\\s\\[\\[`&a-zA-z._@#%*!+,|"\-\'\/\\]\\]{}][0-9\\s]+$')]],
    });
  }

  patchFormData() {
    this.lotsItemForm.patchValue({
      itemName: this.recDataFromSelectItemModal?.itemName,
      plotNumber: '',
      mineral: this.recDataFromSelectItemModal?.mineral,
      area: this.recDataFromSelectItemModal?.area,
      taluka: this.recDataFromSelectItemModal?.taluka,
      latitude: this.recDataFromSelectItemModal?.latitude,
      longitude: this.recDataFromSelectItemModal?.longitude,
      quantity: this.recDataFromSelectItemModal?.quantity,
      district: this.recDataFromSelectItemModal?.district,
      village: this.recDataFromSelectItemModal?.village,
      unitOfMesurment: this.recDataFromSelectItemModal?.unit,
      itemId: this.recDataFromSelectItemModal?.itemId,
    })
  }

  addLotData() {
    if (this.lotsItemForm.value.itemName == '') {
      this.commonService.snackBar('Please Select Item', 1);
      return;
    }
    if (this.lotsItemForm.invalid) {
      return;
    }
    this.buttonText == 'Update Lot' ? (this.addLotDataArray[this.editIndex] = this.lotsItemForm.value) : (this.lotCreationData(), this.addLotDataArray.push(this.lotsItemForm.value));
    this.myForm.resetForm();
    this.defaultLotsItem();
    this.buttonText = 'Add Lot';
    this.dataSource = new MatTableDataSource(this.addLotDataArray);
    this.dataSource.sort = this.sort;
    this.recDataFromSelectItemModal = null; // remove modal data
  }

  deleteLotModel(itemId: any, index: any) {
    const dialog = this.dialog.open(ConfirmationDialogComponent, {
      width: this.apiService.modalSize[1],
      data: { p1: 'Are you sure you want to delete this record?', p2: '', cardTitle: 'Delete', successBtnText: 'Delete', dialogIcon: '', cancelBtnText: 'Cancel' },
    })
    dialog.afterClosed().subscribe(res => {
      if (res == 'Yes') {
        this.deleteLotData(itemId, index);
      }
    })
  }

  deleteLotData(itemId: any, index: any) {
    //If delete the table list remove select Item table
    let findindexOfItemArray = this.commonService.findIndexOfArrayValue(this.feesChargesItemArray, itemId);
    this.feesChargesItemArray.splice(findindexOfItemArray, 1);
    this.addLotDataArray.splice(index, 1);
    this.myForm.resetForm();
    this.dataSource = new MatTableDataSource(this.addLotDataArray);
  }

  editLotData(element: any, index: any) {
    this.editIndex = index;
    this.buttonText = 'Update Lot';
    this.lotsItemForm.patchValue({
      itemName: element.itemName,
      plotNumber: element.plotNumber,
      mineral: element.mineral,
      area: element.area,
      taluka: element.taluka,
      latitude: element.latitude,
      longitude: element.longitude,
      quantity: element.quantity,
      district: element.district,
      village: element.village,
      unitOfMesurment: element.unit,

      tender_ApplicationFee: element.tender_ApplicationFee,
      openingBid: element?.openingBid,
      emD_SecurityDeposit: element.emD_SecurityDeposit,
      offsetValue: element.offsetValue,
      minBidIncrement: element.minBidIncrement,
      gst: element.gst,
      cgst: element.cgst,
      sgst: element.sgst,
      igst: element.igst,
      tcs: element.tcs,
      anyOther: element.anyOther,
      itemId: element.itemId,
    })
  }

  //..................................  Document List Code start Here ................................................//

  getdocumentList() { //Document List Api
    let obj = 'pageno=' + this.pageNumber + '&pagesize=' + 20
    this.apiService.setHttp('get', "document/GetAll?" + obj, false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode === "200") {
          this.documentListArray = res.responseData.responseData1;
          this.editFlag ? this.checkedDocListArraya(this.documentListArray) : this.dataSourceDocument = new MatTableDataSource(this.documentListArray);
        } else {
          this.documentListArray = [];
          this.commonService.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonService.snackBar(res.statusMessage, 1);
        }
      },
      error: ((error: any) => { this.error.handelError(error.status) })
    });
  }

  addEventDocument() { // Selected Document Post Api
    this.apiService.setHttp('POST', 'event-creation/addEventDocument', false, JSON.stringify(this.addEventDocumentArray), false, 'bidderUrl');
    this.apiService.getHttp().subscribe((res: any) => {
      if (res.statusCode == "200") {
        this.commonService.snackBar(res.statusMessage, 0);
      } else {
        this.commonService.snackBar(res.statusMessage, 1);
      }
    }, (error: any) => {
      this.error.handelError(error.status);
    });
  }

  selectDocument(event: any, element: any, docId: any) {
    let obj = {
      "createdBy": this.localstorageService.userId(),
      "modifiedBy": this.localstorageService.userId(),
      "createdDate": new Date(),
      "modifiedDate": new Date(),
      "isDeleted": true,
      "id": 0,
      "eventId": this.EventId,
      "documentId": element.id,
      "documentName": element.documentType,
      "isMandatory": true
    }
    if (event.checked == true) {
      this.addEventDocumentArray.push(obj);
    } else {
      this.addEventDocumentArray.find((ele: any, index: any) => {
        if (ele?.documentId == docId) { this.addEventDocumentArray.splice(index, 1); }
      })
    }
  }

  //..................................  Document List Code End Here ..................................................//

  //.........................  Call Api Submit Lot Creation Code Start Here...........................................//

  lotCreationData() {
    let formData = this.lotsItemForm.value;
    let obj = {
      "createdBy": this.localstorageService.userId(),
      "modifiedBy": this.localstorageService.userId(),
      "createdDate": new Date(),
      "modifiedDate": new Date(),
      "isDeleted": true,
      "id": 0,
      "lotId": "1", // means Ploat Id
      "eventId": parseInt(this.EventId),
      "itemId": parseInt(this.recDataFromSelectItemModal?.itemId),
      "tender_ApplicationFee": parseInt(formData.tender_ApplicationFee),
      "emD_SecurityDeposit": parseInt(formData.emD_SecurityDeposit),
      "openingBid": formData.openingBid,
      "offsetValue": parseInt(formData.offsetValue),
      "minBidIncrement": parseInt(formData.minBidIncrement),
      "gst": parseInt(formData.gst),
      "cgst": parseInt(formData.cgst),
      "sgst": parseInt(formData.sgst),
      "igst": parseInt(formData.igst),
      "tcs": parseInt(formData.tcs),
      "anyOther": parseInt(formData.anyOther),
    }
    this.lotCreationArray.push(obj);
  }

  SubmitLotCreation() {
    if (this.addLotDataArray.length == 0) {
      this.commonService.snackBar('Plaese Add Lot', 1);
    } else if (this.addEventDocumentArray.length == 0) {
      this.commonService.snackBar('Plaese Select Document List', 1);
    } else {

      this.apiService.setHttp(this.editFlag ? 'PUT' : 'POST', 'lot-creation', false, JSON.stringify(this.lotCreationArray), false, 'bidderUrl');
      this.apiService.getHttp().subscribe((res: any) => {
        if (res.statusCode == "200") {
          this.router.navigate(['../../../../event-list'], { relativeTo: this.route })
          this.commonService.snackBar(res.statusMessage, 0);
          this.addEventDocument();
          // this.defaultLotsItem();
          this.addLotDataArray = [];
          this.dataSource = new MatTableDataSource(this.addLotDataArray);
          this.addEventDocumentArray = [];
          this.documentListHide = false;
        } else {
          this.commonService.snackBar(res.statusMessage, 1);
        }
      }, (error: any) => {
        this.error.handelError(error.status);
      });
    }
  }

  clearLotCreationForm() {
    this.defaultLotsItem();
    this.myForm.resetForm();
    this.addLotDataArray = [];
    this.dataSource = new MatTableDataSource(this.addLotDataArray);
    this.addEventDocumentArray = [];
    this.documentListHide = false;
    this.recDataFromSelectItemModal = null;
  }

  //.........................  Call Api Submit Lot Creation Code End Here...........................................//

  //..................................  Select Item Component Code Start Here .......................................//

  openSelectDialog() {
    this.sendItemEnableSub();
    const dialogRef = this.dialog.open(SelectItemComponent, {
      disableClose: true,
      width: this.apiService.modalSize[3],
      height: 'auto',
      data: this.recDataFromSelectItemModal,
    });
    dialogRef.afterClosed().subscribe((result) => { // data get when Model is Closed
      if (result.modalFlag == true) {
        this.recDataFromSelectItemModal = result;
        // this.lotCreationArray = result;
        this.patchFormData();
      } else {
        this.recDataFromSelectItemModal = null;
        this.editFlag == true ? (this.patchFormData()) : this.defaultLotsItem();
      }
    })
  }

  sendItemEnableSub() {
    if (this.addLotDataArray.length >= 1) {
      this.addLotDataArray.find((ele: any) => { this.feesChargesItemArray.push(ele.itemId) });
    }
    this.sharedataService.seletItemArray.next([... new Set(this.feesChargesItemArray)])
  }
  //..................................  Select Item Component Code End Here .........................................//
}
