import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor() {
  }


  //--------------------------------------------mat table setting  start heare ----------------------------------------------//
  pageSize: number = 10;
  matFormField: string | any = 'outline';
  matFormFieldFilter:string|any='outline';
  //--------------------------------------------mat table setting  end heare ----------------------------------------------//

  //--------------------------------------------------google map setting start here ----------------------------------------------------//
  static googleApiObj: object = {
    apiKey: 'AIzaSyAkNBALkBX7trFQFCrcHO2I85Re2MmzTo8',
    language: 'en',
    libraries: ['places', 'geometry'],
  };

  //--------------------------------------------------google map setting end heare----------------------------------------------------//

  // ----------------------send the  ip address to api----------------------
  
  ipAddressUrl:string="https://api.ipify.org?format=json";


}

