import { DatePipe, Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSnackBar, } from '@angular/material/snack-bar';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable, interval } from 'rxjs';
import { map, pairwise } from 'rxjs/operators';
import { filter } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  codecareerPage: any;
  private clock: Observable<Date>;
  oneMonthBeforeDate: any;
  previousUrl!: string;
  previousUrlFlag: any;

  constructor(
    private SnackBar: MatSnackBar,
    private datePipe: DatePipe,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private apiService: ApiService,
    public location: Location
  ) {
    this.clock = interval(1000).pipe(map(() => new Date()))
  }

  snackBar(data: string, status: number) {
    let snackClassArr: any = ['snack-success', 'snack-danger', 'snack-warning'];
    this.SnackBar.open(data, " ", {
      duration: 2000,
      panelClass: [snackClassArr[status]],
      verticalPosition: 'top', // 'top' | 'bottom'
      horizontalPosition: 'right', //'start' | 'center' | 'end' | 'left' | 'right'

    })
  }

  sanckBarHide() {
    this.SnackBar.dismiss();
  }

  pervPage() {
    this.location.back();
  }

  // Captcha code start 
  createCaptchaCarrerPage() {
    //clear the contents of captcha div first
    let id: any = document.getElementById('captcha');
    id.innerHTML = "";
    // "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@!#$%^&*";

    var charsArray = "0123456789";
    var lengthOtp = 4;
    var captcha = [];
    for (var i = 0; i < lengthOtp; i++) {
      //below code will not allow Repetition of Characters
      var index = Math.floor(Math.random() * charsArray.length + 0); //get the next character from the array
      if (captcha.indexOf(charsArray[index]) == -1)
        captcha.push(charsArray[index]);
      else i--;
    }
    var canv = document.createElement("canvas");
    canv.id = "captcha1";
    canv.width = 80;
    canv.height = 30;
    //var ctx:any = canv.getContext("2d");
    var ctx: any = canv.getContext("2d");
    ctx.font = "21px Open Sans";
    ctx.fillText(captcha.join(""), 0, 24);
    // ctx.strokeText(captcha.join(""), 0, 30);
    //storing captcha so that can validate you can save it somewhere else according to your specific requirements
    this.codecareerPage = captcha.join("");
    let appendChild: any = document.getElementById("captcha");
    appendChild.appendChild(canv); // adds the canvas to the body element

  }

  checkvalidateCaptcha() {
    return this.codecareerPage;
  }

  checkDataType(val: any) {
    let value: any;
    if (val == "" || val == null || val == "null" || val == undefined || val == "undefined" || val == 'string' || val == null || val == 0) {
      value = false;
    } else {
      value = true;
    }
    return value;
  }

  findIndexOfArrayObject(array: any, key: any, val: any) { // find index of array object  [{'id:0',:name:'john'}, {'id:1',:name:'deo'}]
    let index = array.findIndex((x: any) => x[key] === val);
    return index
  }

  someOfArrayObject(array: any, key: any, val: any) {
    let flag = array.some((x: any) => x[key] === val);
    return flag
  }

  findIndexOfArrayValue(array: any, val: any) { // find index of array value [1,2,3,4] 
    let index = array.indexOf(val);
    return index
  }

  trackTask(_index: number, item: any): string {
    return `${item.id}`;
  }

  getIdByName(object1: any, object2: any) {
    return object1 && object2 && object1.id === object2.id;
  }

  getCurrentTime() {
    return this.clock;
  }

  setDefValue(formName: FormGroup, formControlName: string, Id: any, array: any) {
    if (array.length == 1) {
      return formName.controls[formControlName].setValue(Id);
    } else {
      return array
    }
  }

  addValidation(formName: FormGroup, formControlName: string, pattren: any) {
    return formName.controls[formControlName].setValidators([pattren]),
      formName.controls[formControlName].updateValueAndValidity();
  }

  removeValidation(formName: FormGroup, formControlName: string,) {
    return formName.controls[formControlName].clearValidators(),
      formName.controls[formControlName].updateValueAndValidity();
  }

  checkFormValueChange(initalValues: any, formValue: any) {
    let checkStatus = JSON.stringify(initalValues) === JSON.stringify(formValue);
    return checkStatus;
  }

  subtractOneMontFromToDate() { //To Date to One Month Before Date Get
    function subtractMonths(numOfMonths: number, date = new Date()) {
      date.setMonth(date.getMonth() - numOfMonths);
      return date;
    }
    const date = new Date();
    this.oneMonthBeforeDate = subtractMonths(1, date);
    return this.oneMonthBeforeDate;
  }

  dateWithTimeFormat(dateTime: any) { // 2022-05-11T13:01:46.067Z
    let dateWithTime = this.datePipe.transform(dateTime, 'yyyy-MM-dd' + 'T' + 'hh:mm:ss.ms');
    return dateWithTime + "Z";
  }

  dateFormat(dateTime: any) { // 2022-05-11T13:01:46.067Z
    let date = this.datePipe.transform(dateTime, 'yyyy-MM-dd');
    return date;
  }

  prevUrl(path: string) {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd),
      pairwise()).subscribe((e: any[]) => {
        this.previousUrl = e[0].url;
        this.previousUrlFlag = this.previousUrl.includes(path);
        return this.previousUrlFlag
      });
    return this.previousUrlFlag;
  }

  removeFilerLocalStorage(flag: any) {
    if (flag == 'filter') {
      localStorage.getItem('filter') ? localStorage.removeItem('filter') : ''
    } else if (flag == 'filter') {
      localStorage.getItem('pagination') ? localStorage.removeItem('pagination') : ''
    }
  }


  oneMonPrevDate() {
    let prevDate = new Date();
    prevDate.setMonth(prevDate.getMonth() - 1);
    return this.dateFormat(prevDate);
  }

  todayDate() { // Today date sel in date picked
    let date = new Date();
    return this.dateFormat(date);
  }

  filter(value: string, array: any, key: any): string[] {
    const filterValue = value.toLowerCase();
    return array.filter((option: any) => option[key].toLowerCase().includes(filterValue.toLowerCase()));
  }

  redirectToNewTab(path: any) {
    window.open(path, '_blank');
  }

  routerLinkRedirect(path: any) {
    this.router.navigate([path], { relativeTo: this.route })
  }

  removeObjFromArray(array: any, key: any, val: any) {
    return array.filter((item: any) => item[key] !== val);
  }

  scrollBar(value: any) {
    window.scroll({
      top: value,
      behavior: 'smooth'
    });
  }

}
