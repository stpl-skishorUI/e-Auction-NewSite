import { TitleCasePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable, startWith } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonService } from 'src/app/core/services/common.service';
import { ConfigService } from 'src/app/core/services/config.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { LocalstorageService } from 'src/app/core/services/localstorage.service';
import { ValidatorService } from 'src/app/core/services/validator.service';

@Component({
  selector: 'vex-add-page',
  templateUrl: './add-page.component.html',
  styleUrls: ['./add-page.component.scss']
})
export class AddPageComponent implements OnInit {

  @ViewChild(FormGroupDirective) formGroupDirective!: FormGroupDirective;
  addPageForm: FormGroup |any;
  saveUpdateBtn: string = 'Submit';
  editFlag: boolean = false;
  getAllPageName: any;
  pageNameArray: any;
  searchPageObs!: Observable<any> | any;
  pageAddType = ['Inside Module', 'Show in Side Bar', 'Show in inside Module'];

  constructor(public dialogRef: MatDialogRef<AddPageComponent>,
   
    public validatorService: ValidatorService,
    private fb: FormBuilder,
    private apiService: ApiService,
    public commonService: CommonService,
    private errorsService: ErrorsService,
    private localstorageService: LocalstorageService,
    private titleCasePipe: TitleCasePipe,

    @Inject(MAT_DIALOG_DATA) public data: any ,//
    
    public configService:ConfigService) { }

  ngOnInit(): void {
    this.defultForm();
    this.commonService.checkDataType(this.data) == true ? this.patchData() : '';
    // console.log(this.data);
    this.getModuleName();
    this.getAllPages();
   
    this.searchPageObs = this.addPageForm.controls.module.valueChanges.pipe(startWith(''), map((value: any) => this.commonService.filter(value, this.pageNameArray, 'module')),);
  }

  getModuleName() {
    let pageName = this.localstorageService.getAllPageName();
    this.getAllPageName = pageName.filter((ele: any) => {
      if (ele.isSideBarMenu == true) {
        return ele;
      }
    })
  }

  defultForm() {
    this.addPageForm = this.fb.group({
      pageName: ['', [Validators.required]],
      pageType: [0],
      pageURL: ['', [Validators.required, Validators.pattern('^[^\\s\\[\\[`&._@#%*!+0-9"\'\/\\]\\]{}][a-zA-Z-/:_/\\s]+$')]],
      module: [''],
      menuIcon: [''],
      isSideBarMenu: ['', Validators.required]
    });
  }

  get fcontrol() { return this.addPageForm.controls }


  hideModule(event: any) {
    this.addPageForm.controls["module"].reset();
    event.value == 'Show in inside Module' ? (this.addPageForm.get('module')?.setValidators([Validators.required])) : (this.addPageForm.controls["module"].clearValidators());
    this.addPageForm.controls["module"].updateValueAndValidity();
  }

  saveUpdateData() {
    if (this.addPageForm.invalid) {
      return
    }
    let formData = this.addPageForm.value;
    console.log(formData);
    let obj = {
      pageId: this.commonService.checkDataType(this.data) == true ? this.data.pageId : 0,
      pageName: this.titleCasePipe.transform(formData.pageName),
      pageNameView: this.titleCasePipe.transform(formData.pageName),
      pageType: 0,
      pageURL: formData.pageURL,
      isDSC: false,
      createdBy: this.localstorageService.userId(),
      createdDate: new Date(),
      isDeleted: false,
      module: formData.isSideBarMenu == 'Show in inside Module' ? this.titleCasePipe.transform(formData.module) : this.titleCasePipe.transform(formData.pageName),
      isSideBarMenu: formData.isSideBarMenu == 'Inside Module' ? 0 : formData.isSideBarMenu == 'Show in Side Bar' ? 1 : 2,
      menuIcon: formData.menuIcon,
    }
    let reqType: string;
    let apiName: string;
    this.editFlag ? (reqType = 'PUT', apiName = 'UpdatePage') : (reqType = 'POST', apiName = 'AddPage');
    this.apiService.setHttp(reqType, "pagemaster/" + apiName, false, JSON.stringify(obj), false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode === "200") {
          this.commonService.snackBar(res.statusMessage, 0);
          let data = this.data ? this.data : 'post';
          this.dialogRef.close(data);
        } else {
          this.commonService.checkDataType(res.statusMessage) == false ? this.errorsService.handelError(res.statusCode) : this.commonService.snackBar(res.statusMessage, 1);
        }
      },
      error: ((error: any) => { this.errorsService.handelError(error.status) })
    });
  }


  patchData() {
    this.editFlag = true;
    this.saveUpdateBtn = 'Update';

    this.addPageForm.patchValue({
      pageName: this.data?.pageName,
      pageType: this.data?.pageType,
      pageURL: this.data?.pageURL,
      module: this.data?.module,
      menuIcon: this.data?.menuIcon,
      isSideBarMenu: this.data?.isSideBarMenu == 0 ? 'Inside Module' : this.data?.isSideBarMenu == 1 ? 'Show in Side Bar' : 'Show in inside Module',
    })
  }

  getAllPages() {
    let pagSize = 100
    this.apiService.setHttp("get", "pagemaster/GetAll?pageno=1&pagesize=" + pagSize, false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode === "200") {
          this.pageNameArray = res.responseData.responseData1;
          this.getModuleList();


        } else {
          this.commonService.checkDataType(res.statusMessage) == false ? this.errorsService.handelError(res.statusCode) : this.commonService.snackBar(res.statusMessage, 1);
        }
      },
      error: ((error: any) => { this.errorsService.handelError(error.status) })
    });
  }

  getModuleList(){
    let loginPages: any[] = [];
    this.pageNameArray.find((item: any) => {
      let existing: any = loginPages.filter((v: any) => {
        return v.module == item.module;
      });
      if (existing.length) {
        let existingIndex: any = loginPages.indexOf(existing[0]);
        loginPages[existingIndex].pageURL = loginPages[existingIndex].pageURL.concat(item.pageURL);
        loginPages[existingIndex].pageName = loginPages[existingIndex].pageName.concat(item.pageName);
      } else {
        if (typeof item.pageName == 'string')
          item.pageURL = [item.pageURL];
        item.pageName = [item.pageName];
        loginPages.push(item);
      }
    });
    this.pageNameArray = loginPages;
  }



  clear() {
    this.data ? this.saveUpdateBtn = 'Update' : this.saveUpdateBtn = 'Submit';
    this.formGroupDirective.resetForm();
    this.addPageForm.controls["module"].clearValidators();
    this.addPageForm.controls["module"].updateValueAndValidity();
  }


  close(flag:string){
this.dialogRef.close(flag);
  }

}
