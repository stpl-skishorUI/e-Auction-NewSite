import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {
  getlocalStorageData: any;

  constructor() { }

  checkUserIsLoggedIn() { // check user isLoggedIn or not  
    let sessionData: any = sessionStorage.getItem('loggedIn');
    sessionData == null || sessionData == '' ? localStorage.clear() : '';
    if (localStorage.getItem('user') && sessionData == 'true') return true;
    else return false;
  }

  getLoggedInLocalstorageData() {
    if(this.checkUserIsLoggedIn() == true)
   {  let data = JSON.parse(localStorage['user']);
   return data;}
  }

  loggedInUserName() {
    let data = JSON.parse(localStorage['user']);
    return data?.responseData['userName'];
  }

  getSelLanguage() {
    let getLanguage = localStorage.getItem('lang');
    return getLanguage;
  }

  userId() {
    let userId = this.getLoggedInLocalstorageData();
    return userId?.responseData?.id;
  }

  profilePath() {
    let userId = this.getLoggedInLocalstorageData();
    let profilePath = userId.responseData?.profilePath == "" || userId.responseData?.profilePath == null || userId.responseData?.profilePath == undefined ? 'assets/images/user.png' : userId.responseData?.profilePath;
    return profilePath;
  }

  userTypeId() {
    let userTypeId = this.getLoggedInLocalstorageData();
    return userTypeId.responseData?.userTypeId;
  }

  subUserTypeId() {
    let userTypeId = this.getLoggedInLocalstorageData();
    return userTypeId.responseData?.subUserTypeId;
  }

  getAllPageName() {
    let getAllPageName = this.getLoggedInLocalstorageData();
    return getAllPageName.responseData1.pageUrls;
  }

  redirectToDashborad() {
    let logInUserType: any = this.getAllPageName();
    let redirectToDashboard = logInUserType[0].pageURL;
    return redirectToDashboard;
  }

  getRoleTypeId(){
    let localData=this.getLoggedInLocalstorageData();
   return localData.responseData.roleId;
  }

  getBidderId(){
    let localData=this.getLoggedInLocalstorageData();
   return localData.responseData.bidderId;
  }
}
