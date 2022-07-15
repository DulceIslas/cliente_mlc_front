import { ApiService } from './../../shared/services/api.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'app/shared/auth/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.scss']
})
export class ContactoComponent implements OnInit {

  loginFormSubmitted = false;
  isLoginFailed = false;
  nombre = "";
  mail = "";

  frm = new FormGroup({
    asunto: new FormControl('', [Validators.required]),
    mensaje: new FormControl('', [Validators.required])
  });

  constructor(
    private router: Router,
    private auth: AuthService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private api: ApiService,
    public jwtHelper: JwtHelperService
  ) {
    this.getUserById();
  }

  get lf() {
    return this.frm.controls;
  }

  ngOnInit(): void {
  }

  getUserById() {
    let tk = localStorage.getItem("tokenApp").toString();
    console.log(tk);
    console.log(this.jwtHelper.decodeToken(localStorage.getItem("tokenApp").toString()));
    let idUser= this.jwtHelper.decodeToken(localStorage.getItem("tokenApp").toString())["iss"];
    this.api
    .getUserById(idUser, this.auth.currentTokenValue)
    .pipe(first())
    .subscribe(
      (data: any) => {
        let arrTemp = [];
        let persona = data;
        console.log("getUserById", data);
        this.nombre = persona["personaFisica"]['nombre'] + ' ' + persona["personaFisica"]['primerApellido'] + ' ' + persona["personaFisica"]['segundoApellido'];
        this.mail= persona['usuario']['usuario'];
        this.spinner.hide();
      },
      (error) => {
        console.log("Error: ", error);
      }
    );
}

  onSubmit() {
    this.loginFormSubmitted = true;
    this.isLoginFailed = false;
    let arrSend = [];
    if (this.frm.invalid) {
      return;
    }

    this.spinner.show(undefined,
      {
        type: 'ball-triangle-path',
        size: 'medium',
        bdColor: 'rgba(0, 0, 0, 0.8)',
        color: '#fff',
        fullScreen: true
      });

      arrSend.push({
        "nombre": this.nombre,
        "correo": this.mail,
        "asunto": this.frm.value.asunto,
        "mensaje": this.frm.value.mensaje,
      });

    this.api
    .postCorreoContacto(JSON.stringify(arrSend[0]), this.auth.currentTokenValue)
    .pipe(first())
    .subscribe(
      (data) => {
        console.log(data);

          Swal.fire({
            title: "Gracias por contactarnos",
            text: data.mss,
          });
          this.spinner.hide();

      },
      (error) => {
        console.log(error);
        this.isLoginFailed = true;
        this.loginFormSubmitted = false;
        this.ref.detectChanges();
      }
    );
  }

}

