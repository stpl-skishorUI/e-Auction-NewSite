export class BidderList {
    address: string;
    bidderId: number;
    bidderType: string;
    bidderUserDocuments: bidderUserDocuments[];
    contactPersonMobile: string;
    contactPersonName: string;
    designation: string;
    designationId: number;
    district: string;
    districtId: number;
    email: string;
    isBlock: false;
    isDsc: false;
    mobile: string;
    name: string;
    organizationType: number;
    organizationTypeId: number;
    pinCode: string;
    projectId: number;
    stateId: number;
    userId: number;
    verfiedOTPId: number;
}

export interface bidderUserDocuments {
    docNo: string;
    docPath: string;
    docType: string;
    docTypeId: number;
    documentDate: string;
    entity: string;
    filename: string;
    id: number;
    refId: number;
    remark: string;
}

