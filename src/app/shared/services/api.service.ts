import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpErrorResponse,
} from "@angular/common/http";

import { map, catchError, tap } from "rxjs/operators";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private currentTokenSubject: BehaviorSubject<any>;
  public currentToken: Observable<any>;

  secretKey = "4pK3y4WeBM1C1..$";
  encryptedData = "";

  // UAT
  // private url = "http://mlc.monitorproyecto.com:8081/api/v1";
  // DEV
  private url = "http://mlc.monitorproyecto.com:9091/api/v1";


  constructor(private _http: HttpClient) {

    this.currentTokenSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem("tokenApp"))
    );

    this.currentToken = this.currentTokenSubject.asObservable();

   }

   loginapp() {

    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'byapplogin': 'true'
    };
    return this._http.post(`${this.url}/auth/loginapp`,
    {
      "appKey": this.encrypt('4pK3y4WeB..$')
    },
    {headers}
    ).pipe(
      map((data : any) => {
        if (data.idToken) {
          // console.log(data.idToken);
          localStorage.setItem("tokenApp", JSON.stringify(data.idToken));
          this.currentTokenSubject.next(data.idToken);
          // this.startRefreshTokenTimer();
        }
        return data
      }
      ),
      catchError((e) => throwError(e))
    );
  }

  public get currentTokenValue() {
    return this.currentTokenSubject.value;
  }

  getCuestionario(id, token) {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Bearer ' + token,
      'byapplogin': 'true'
    };
    return this._http.get(this.url + "/questionsheet/byid/" + id, {headers}).pipe(
      map((data) => data),
      catchError((e) => throwError(e))
    );
  }

  getPropuesta(curp, token) {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Bearer ' + token,
      'byapplogin': 'true'
    };
    return this._http.get(this.url + "/getPropuesta/" + curp, {headers}).pipe(
      map((data) => data),
      catchError((e) => throwError(e))
    );
  }

  getResumenPropuesta(curp, token) {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Bearer ' + token,
      'byapplogin': 'true'
    };
    return this._http.get(this.url + "/getResumenPropuesta/" + curp, {headers}).pipe(
      map((data) => data),
      catchError((e) => throwError(e))
    );
  }

  getPlan(token) {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Bearer ' + token,
      'byapplogin': 'true'
    };
    return this._http.get(this.url + "/plan/all/", {headers}).pipe(
      map((data) => data),
      catchError((e) => throwError(e))
    );
  }

  getPais(token) {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Bearer ' + token,
      'byapplogin': 'true'
    };
    return this._http.get(this.url + "/getCatPais", {headers}).pipe(
      map((data) => data),
      catchError((e) => throwError(e))
    );
  }

  getEstado(idPais, token) {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Bearer ' + token,
      'byapplogin': 'true'
    };
    return this._http.get(this.url + "/getCatEstado/" + idPais, {headers}).pipe(
      map((data) => data),
      catchError((e) => throwError(e))
    );
  }

  getDataBeneficiariosById(id, token) {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Bearer ' + token,
      'byapplogin': 'true'
    };
    return this._http.get(this.url + "/propuesta/alldatabyid/" + id, {headers}).pipe(
      map((data) => data),
      catchError((e) => throwError(e))
    );
  }

  postCuestionario(sendArray, token) {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Bearer ' + token,
      'byapplogin': 'true'
    };


    return this._http.post(`${this.url}/register/create`, sendArray,
    {headers}
    ).pipe(
      map((data : any) => {
        return data
      }
      ),
      catchError((e) => throwError(e))
    );
  }

  postAceptarPropuesta(sendArray, token) {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Bearer ' + token,
      'byapplogin': 'true'
    };


    return this._http.post(`${this.url}/propuesta/aceptar`, sendArray,
    {headers}
    ).pipe(
      map((data : any) => {
        return data
      }
      ),
      catchError((e) => throwError(e))
    );
  }

  addUserTitularPareja(sendArray, token) {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Bearer ' + token,
      'byapplogin': 'true'
    };


    return this._http.post(`${this.url}/user/create`, sendArray,
    {headers}
    ).pipe(
      map((data : any) => {
        return data
      }
      ),
      catchError((e) => throwError(e))
    );
  }

  updateUserTitularPareja(sendArray, token) {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Bearer ' + token,
      'byapplogin': 'true'
    };


    return this._http.put(`${this.url}/user/update`, sendArray,
    {headers}
    ).pipe(
      map((data : any) => {
        return data
      }
      ),
      catchError((e) => throwError(e))
    );
  }


  addUserBeneficiario(sendArray, token) {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Bearer ' + token,
      'byapplogin': 'true'
    };


    return this._http.post(`${this.url}/user/create`, sendArray,
    {headers}
    ).pipe(
      map((data : any) => {
        return data
      }
      ),
      catchError((e) => throwError(e))
    );
  }

  updateUserBeneficiario(sendArray, token) {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Bearer ' + token,
      'byapplogin': 'true'
    };


    return this._http.put(`${this.url}/user/update`, sendArray,
    {headers}
    ).pipe(
      map((data : any) => {
        return data
      }
      ),
      catchError((e) => throwError(e))
    );
  }

  postIntentarPagar(sendArray, token) {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Bearer ' + token,
      'byapplogin': 'true'
    };


    return this._http.post(`${this.url}/pagoservice/pagar`, sendArray,
    {headers}
    ).pipe(
      map((data : any) => {
        return data
      }
      ),
      catchError((e) => throwError(e))
    );
  }

  postCorreoContacto(sendArray, token) {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Bearer ' + token,
      'byapplogin': 'true'
    };


    return this._http.post(`${this.url}/formContacto/sendEmail`, sendArray,
    {headers}
    ).pipe(
      map((data : any) => {
        return data
      }
      ),
      catchError((e) => throwError(e))
    );
  }

  postSendEmail(curp) {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    };


    return this._http.post(`${this.url}/reco/sendEmail`,{curp},
    {headers}
    ).pipe(
      map((data : any) => {
        return data
      }
      ),
      catchError((e) => throwError(e))
    );
  }



  // *********************** Titular ****************************** //
  // *********************** Titular ****************************** //
  // *********************** Titular ****************************** //
  // *********************** Titular ****************************** //
  // *********************** Titular ****************************** //

  getUserById(id, token) {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Bearer ' + token
    };
    return this._http.get(this.url + "/user/byid/" + id, {headers}).pipe(
      map((data) => data),
      catchError((e) => throwError(e))
    );
  }

  getPropuestaCurpOMembresia(curpMembresia, token) {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Bearer ' + token
    };
    return this._http.get(this.url + "/getPropuestaCurpOMembresia/" + curpMembresia, {headers}).pipe(
      map((data) => data),
      catchError((e) => throwError(e))
    );
  }

  getPagosPropuesta(curpMembresia, token) {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Bearer ' + token
    };
    return this._http.get(this.url + "/getPagosPropuesta/" + curpMembresia, {headers}).pipe(
      map((data) => data),
      catchError((e) => throwError(e))
    );
  }

  putStatus(token, propuestId, estatus) {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Bearer ' + token,
      'byapplogin': 'true'
    };

    let sendArray = [];

    sendArray.push({
        "propuestaId": propuestId,
        "status": estatus
    });

    return this._http.put(`${this.url}/propuesta/status`, sendArray[0],
    {headers}
    ).pipe(
      map((data : any) => {
        return data
      }
      ),
      catchError((e) => throwError(e))
    );
  }

  putPassword(token,newPass,newPassConfirm) {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    };


    return this._http.put(`${this.url}/reco/updPass`,{token,newPass,newPassConfirm},
    {headers}
    ).pipe(
      map((data : any) => {
        return data
      }
      ),
      catchError((e) => throwError(e))
    );
  }





  // *********************** Fin Titular ****************************** //
  // *********************** Fin Titular ****************************** //
  // *********************** Fin Titular ****************************** //
  // *********************** Fin Titular ****************************** //
  // *********************** Fin Titular ****************************** //

  encrypt(textToEncrypt) {
    var secretK64 = btoa(this.secretKey);
    var key = CryptoJS.enc.Base64.parse(secretK64);
    var encryptedData = CryptoJS.AES.encrypt(textToEncrypt, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return "" + encryptedData
  }

  decrypt(textToDecrypt: string) {
    var secretK64 = btoa(this.secretKey);
    var key = CryptoJS.enc.Base64.parse(secretK64);
    var decryptedData = CryptoJS.AES.decrypt(textToDecrypt, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    var decryptedText = decryptedData.toString( CryptoJS.enc.Utf8 );

    return decryptedText
  }

// helper methods

private refreshTokenTimeout;

private startRefreshTokenTimer() {
    // parse json object from base64 encoded jwt token
    const jwtToken = JSON.parse(atob(this.currentTokenValue.split('.')[1]));

    // set a timeout to refresh the token a minute before it expires
    // const expires = new Date(jwtToken.exp * 1000);
    // const timeout = expires.getTime() - Date.now() - (60 * 1000);

    this.refreshTokenTimeout = setTimeout(() => this.loginapp().subscribe(), 1500000);
}

private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
}


}
