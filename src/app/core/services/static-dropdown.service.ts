import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StaticDropdownService {

  constructor() { }

  approvedStatus() {  //ApprovedStatus Dropdown
    let ApprovedStatus = [{ text: 'All', val: '' },{ text: 'Approved', val: 'Approved' },{ text: 'Pending', val: 'Pending' }, { text: 'Rejected', val: 'Rejected' }];
    return ApprovedStatus;
  }

  getSelectLevel(All?:any) {
    let selectLevel = [{ text: 'All', val: '' }, { text: 'State Level', val: 'State' },{ text: 'District Level', val: 'District' }, { text: 'SDO Level', val: 'SDO'},
    { text: 'Tahsil Level', val: 'Tahsil' }];
    All == true ? selectLevel : selectLevel.splice(0,1);
    return selectLevel;
  }

 StatusInt() {  //ApprovedStatus Dropdown
    let ApprovedStatus = [{ text: 'All', val:0 },{ text: 'Approved', val: 0 },{ text: 'Pending', val: 1}, { text: 'Rejected', val: 2 }];
    return ApprovedStatus;
  }

  eventLevel: string[] = ["State", "District", "SDO", "Tahsil"];

}
