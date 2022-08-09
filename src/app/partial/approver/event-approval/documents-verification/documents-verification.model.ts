export class DocumentsVerification {
approvedBy: number
approvedDatetime: string
approvedRemark: string
bidSubmissionEndDate: string
bidSubmissionStartDate: string
createdBy: number
createdByName: string
createdDate: string
description: string
district: string
districtId:number
documentPath: string
endDateTime: string
eventCode: string
eventFee: number
eventLevel: string
eventLevelId: number
eventType: string
id: number
isPublished: boolean
isSendforApproval:  boolean
startDateTime:string
status: string
subDivision:number | null
subDivisionId: number
taluka:number | null
talukaId:number
title: string
totalItem: number

}

export class DocumentsByCriteria {
approvedRemark: string
bidderId: number
documentApproveName: string
documentApprovedBy: true
documentApprovedDatetime: string
documentApprovedStatus: string
documentDate: null | number
documentId: number
documentName: string
documentNo: null | number
documentPath: string
eventDocumentId: number
eventId: number
eventParticipateId: number
id: number
isDocumentApproved: boolean
isMandatory: boolean
}
