import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonService } from 'src/app/core/services/common.service';
import { ErrorsService } from 'src/app/core/services/errors.service';

@Component({
  selector: 'vex-auction-plot-profile',
  templateUrl: './auction-plot-profile.component.html',
  styleUrls: ['./auction-plot-profile.component.scss']
})
export class AuctionPlotProfileComponent implements OnInit {
  syniseplotIdArray:any;
  GeofenceMasterBysynisePlotIdArray:any;
  newsDocumentArr :any;
  dataSource:any;
  polygonLatLong:any;
  lat: any;
  lng: any;
  constructor(
    private error: ErrorsService,
    private apiService: ApiService,
    public commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AuctionPlotProfileComponent>
  ) { }

  ngOnInit(): void {
    this.getBySyniseplotId();
    this.getGeofenceMasterBysynisePlotId();
  } 
  getBySyniseplotId() {
    this.apiService.setHttp('get', "eauction-plot-registration/GetBySyniseplotId?SyniseplotId=" + this.data, false, false, false, 'mineralUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode === "200") {
          this.syniseplotIdArray = res.responseData;
        console.log(this.syniseplotIdArray);
        
          this.syniseplotIdArray?.documentMaster.map((ele: any, index: any) => { ele['srNo'] = index + 1; }) // add sr no
          this.newsDocumentArr = this.splitDocumentArray(this.syniseplotIdArray.documentMaster, 3);

          this.dataSource = new MatTableDataSource(res.responseData?.siteRegisterResponseModels);
        } else {
          this.syniseplotIdArray = [];
          this.commonService.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonService.snackBar(res.statusMessage, 1);
        }
      },
      error: ((error: any) => { this.error.handelError(error.status) })
    });
  }

  
  splitDocumentArray(arr: any, size: any) {
    let newArr = [];
    for (let i = 0; i < arr.length; i += size) {
      newArr.push(arr.slice(i, i + size));
    }
    return newArr;
  }

  getGeofenceMasterBysynisePlotId() {
    this.apiService.setHttp('get', "eauction-geofence-wrapper/GetGeofenceMasterBysynisePlotId?SyniseplotId=6", false, false, false, 'mineralUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode === "200") {
          this.GeofenceMasterBysynisePlotIdArray = res.responseData;
          this.polygonLatLong = this.GeofenceMasterBysynisePlotIdArray?.geofenceMaster.polygonText;
          this.lat = this.polygonLatLong.split(' ')[0];
          this.lng = this.polygonLatLong.split(' ')[1];
        } else {
          this.GeofenceMasterBysynisePlotIdArray = [];
          this.commonService.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonService.snackBar(res.statusMessage, 1);
        }
      },
      error: ((error: any) => { this.error.handelError(error.status) })
    });
  }

}
