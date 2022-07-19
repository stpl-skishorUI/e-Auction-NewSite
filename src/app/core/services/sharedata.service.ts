import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedataService {

  public langSubject = new Subject();   //for lag sel  Subject


  public internetModalClosed = new Subject();   //check internet status

  public sendLotsUploadData = new Subject();   //check internet status

  public profileImgUpdate = new Subject();   //check internet status
  
  public seletItemArray = new BehaviorSubject<any>('');   //data pass lots uplod to shared data

  public homePagefilterData = new BehaviorSubject<any>('');   //data pass lots uplod to shared data

  public webHeaderLogOut = new Subject<any>();   //check logout btn press in home page or not

  constructor() { }
}
