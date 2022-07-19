import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class MasterService {
  OrganizationType = [];
  resStates = [];
  resDistricts = [];
  resTalukas = [];
  resUserRoles = [];
  resLevels = [];
  resMaterials = [];
  resDivision = [];
  resDistrictByDivision = [];
  resVillageByDistrict = [];
  resdesignation = [];
  resSubUserType: any = [];
  resUserType: any = [];
  resSubDivision: any = [];
  resProjectData: any = [];
  eventDocumentData: any = [];
  eventItemDetail: any = [];

  constructor(private apiService: ApiService) { }

  getOrganizationType() {
    return new Observable((obj) => {
      this.apiService.setHttp('get', "organization-type/getAll", false, false, false, 'masterUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode === "200") { this.OrganizationType = res.responseData; obj.next(this.OrganizationType); } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })

    })
  }

  getState() {
    return new Observable((obj) => {
      this.apiService.setHttp('get', "state-master/GetAll", false, false, false, 'masterUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode === "200") { this.resStates = res.responseData; obj.next(this.resStates); } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    })
  }

  getDistrict(stateId: number) {
    return new Observable((obj) => {
      this.apiService.setHttp('get', "district-master/getByDivisionId?DivisionId=" + stateId, false, false, false, 'masterUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode === "200") { this.resDistricts = res.responseData; obj.next(this.resDistricts); } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })

    })
  }

  getTaluka(disId: number) {
    return new Observable((obj) => {
      this.apiService.setHttp('get', "taluka-master/GetByDistrictId?DistrictId=" + disId, false, false, false, 'masterUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode === "200") { this.resTalukas = res.responseData; obj.next(this.resTalukas); } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    })
  }

  getLevel() {
    return new Observable((obj) => {
      this.apiService.setHttp('get', "level/GetAll", false, false, false, 'masterUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode === "200") { this.resLevels = res.responseData; obj.next(this.resLevels); } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })

    })
  }


  getUserRole(UserTypeId?: any, ProjectId?: any) {
    return new Observable((obj) => {
      this.apiService.setHttp('get', "user-role/GetAll?UserTypeId=" + UserTypeId + "&ProjectId=" + ProjectId + "", false, false, false, 'masterUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode === "200") { this.resUserRoles = res.responseData; obj.next(this.resUserRoles); } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    })
  }

  getMaterial() {
    return new Observable((obj) => {
      this.apiService.setHttp('get', "material-master/getAll", false, false, false, 'masterUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode === "200") { this.resMaterials = res.responseData; obj.next(this.resMaterials); } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    })
  }

  getDivisionByStateId(stateId: number) {
    return new Observable((obj) => {
      this.apiService.setHttp('get', "division-master/GetByStateId?StateId=" + stateId, false, false, false, 'masterUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode === "200") { this.resDivision = res.responseData; obj.next(this.resDivision); } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    }
    )
  }

  getDistrictByDivisionId(divisionId: number) {
    return new Observable((obj) => {
      this.apiService.setHttp('get', "district-master/getByDivisionId?DivisionId=" + divisionId, false, false, false, 'masterUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode === "200") { this.resDistrictByDivision = res.responseData; obj.next(this.resDistrictByDivision); } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    }
    );
  }

  getVillageByDistrictId(districtId: number) {
    return new Observable((obj) => {
      this.apiService.setHttp('get', "village/GetVillageByDistrictId?DistrictId=" + districtId, false, false, false, 'masterUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode === "200") { this.resVillageByDistrict = res.responseData; obj.next(this.resVillageByDistrict); } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    }
    );
  }

  getDesignation() {
    return new Observable((obj) => {
      this.apiService.setHttp('get', "designation/GetAll", false, false, false, 'masterUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode === "200") { this.resdesignation = res.responseData; obj.next(this.resdesignation); } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    }
    );
  }

  getUserType() {
    return new Observable((obj) => {
      this.apiService.setHttp('get', "user-type/getAll", false, false, false, 'masterUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode === "200") { this.resUserType = res.responseData; obj.next(this.resUserType); } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    }
    );
  }

  getSubuserType(userTypeId: number, projectId: number) {
    return new Observable((obj) => {
      this.apiService.setHttp('get', "subusertype/GetAllByUserTypeId?UserTypeId=" + userTypeId + "&ProjectId=" + projectId, false, false, false, 'masterUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode === "200") { this.resSubUserType = res.responseData; obj.next(this.resSubUserType); } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    });
  }

  getSubdivision(districtId: number) {
    return new Observable((obj) => {
      this.apiService.setHttp('get', "subdivision-master/getByDistrictId?DistrictId=" + districtId, false, false, false, 'masterUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode === "200") { this.resSubDivision = res.responseData; obj.next(this.resSubDivision); } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    });
  }

  getProjectId() {
    return new Observable((obj) => {
      this.apiService.setHttp('get', "project/GetAll", false, false, false, 'masterUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode === "200") { this.resProjectData = res.responseData; obj.next(this.resProjectData); } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    });
  }


  getEventRequiredDocumentList(EventId: any) {
    return new Observable((obj) => {
      this.apiService.setHttp('get', "event-document/getDocByEventId?EventId=" + EventId, false, false, false, 'bidderUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode === "200") { this.eventDocumentData = res.responseData; obj.next(this.eventDocumentData); } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      });
    });
  }
  

  getEventItemDetail(EventId:any) {
    return new Observable((obj) => {
    this.apiService.setHttp('get', "lot-creation/getByEventId/" + EventId, false, false, false, 'bidderUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => { if (res.statusCode === "200") { this.eventItemDetail = res.responseData; obj.next(this.eventItemDetail); } else { obj.error(res); } },
      error: (e: any) => { obj.error(e) }
    });
  });
  }
}
