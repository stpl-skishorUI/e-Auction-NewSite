export interface UserRegistration {

    approverId: number | null;
    bidderId: number | null;
    designation: string;
    designationId: number;
    district: number | null;
    districtId: number;
    division: number | null;
    divisionId: number | null
    emailId: string;
    id: number;
    isBlock: boolean |any;
    isDsc: boolean | any;
    mobileNo: string;
    name: string;
    password: string;
    profilePath: string;
    projectId: number;
    projectName: string;
    roleId: number;
    roleType: string;
    sellerId: number;
    state: string;
    stateId: number;
    subDivision: null | any;
    subDivisionId: number | null;
    subUserType: string | null;
    subUserTypeId: number | null;
    taluka: null | string;
    talukaId: number | null;
    userAddress: string | null;
    userName: string | null;
    userType: string;
    userTypeId: number;
    villageId: number | null;
    villageName: null | string;
    labels: any;
    action:any;
//     constructor(userRegistration) {
// this.approverId=userRegistration.approverId

//     }
}
