import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import firebase from 'firebase/app'
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';

const headers_object = new HttpHeaders();
headers_object.append("Content-Type", "application/json");
// headers_object.append("Authorization", "Basic " + btoa("client:client"));
headers_object.append("Access-Control-Allow-Origin", "*");

@Injectable()
export class AuthService {
  private currentTokenSubject: BehaviorSubject<any>;
  public currentToken: Observable<any>;

  secretKey = "4pK3y4WeBM1C1..$";

   // Dev

  url = "http://mlc.monitorproyecto.com:9091/api/v1";

  // UAT

  // url = "http://mlc.monitorproyecto.com:8081/api/v1";


  constructor(private http: HttpClient, public router: Router) {
    this.currentTokenSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem("tokenApp"))
    );

    this.currentToken = this.currentTokenSubject.asObservable();
  }

  public get currentTokenValue() {
    return this.currentTokenSubject.value;
  }

  signupUser(username: string, password: string) {
    //your code for signing up the new user
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.currentTokenValue.currentUserValue;
    // console.log(currentUser);
    if (currentUser) {
      // authorised so return true
      return true;
    } else {
      // not logged in so redirect to login page with the return url
      this.router.navigate(["./pages/home"]);
    }

    return false;
  }

  signinUser(username: string, pwd: string) {
    const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
    var password = this.encrypt(pwd);

    localStorage.setItem("mail", username);
    localStorage.setItem("identityp", password);

    return this.http
      .post<any>(`${this.url}/auth/login`, { username, password }, {headers})
      .pipe(
        map((data) => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          if (data.idToken) {
            localStorage.setItem("tokenApp", JSON.stringify(data.idToken));
          this.currentTokenSubject.next(data.idToken);
          }
          return data;
        })
      );
  }

  resigninUser(username: string, password: string) {
    const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
    return this.http
      .post<any>(`${this.url}/auth/login`, { username, password }, {headers})
      .pipe(
        map((data) => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          if (data.idToken) {
            localStorage.setItem("tokenApp", JSON.stringify(data.idToken));
          this.currentTokenSubject.next(data.idToken);
          }
          return data;
        })
      );
  }

  logout() {
    localStorage.removeItem("tokenApp");
    localStorage.removeItem("token");
    this.currentTokenSubject.next(null);
    this.router.navigate(["./pages/home"]);
  }

  isAuthenticated() {
    return true;
  }

  encrypt(textToEncrypt) {
    var secretK64 = btoa(this.secretKey);
    var key = CryptoJS.enc.Base64.parse(secretK64);
    var encryptedData = CryptoJS.AES.encrypt(textToEncrypt, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return "" + encryptedData
    // return CryptoJS.AES.encrypt(value, this.secretKey).toString();
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
    // return CryptoJS.AES.decrypt(textToDecrypt, this.secretKey).toString(CryptoJS.enc.Utf8);
  }


}
